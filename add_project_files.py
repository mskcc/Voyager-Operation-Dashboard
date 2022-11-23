import os
import json
import requests
from requests.auth import HTTPBasicAuth
import copy
import random


BEAGLE_ENDPOINT = os.environ.get('BEAGLE_ENDPOINT', 'http://localhost:8081')
BEAGLE_USER = os.environ.get('BEAGLE_USER', 'admin')
BEAGLE_PW = os.environ.get('BEAGLE_PW', 'correctHorseBatteryStaple')
JOB_MODEL_URL = os.environ.get(
    'JOB_MODEL_URL', 'http://localhost:8000/api/jobs/')


def get_pair_info():
    pair_info = {}
    run_data = requests.get(BEAGLE_ENDPOINT + "/v0/run/api/?values_run=tags,job_group&page_size=10000",
                            auth=HTTPBasicAuth(BEAGLE_USER, BEAGLE_PW))
    for job_group, tags in run_data.json()['results']:
        if job_group not in pair_info:
            pair_info[job_group] = {'pairs': []}
        pair_info[job_group]['pairs'].append(tags)
    return pair_info


def create_pairing_file(pair_info):
    pairing_file_data = ""
    for single_pair in pair_info['pairs']:
        pairing_file_data += single_pair["sampleNameNormal"] + \
            "\t" + single_pair["sampleNameTumor"] + "\n"
    return pairing_file_data


def create_mapping_file(pair_info):
    mapping_file_data = ""
    samples_mapped = []
    for single_pair in pair_info['pairs']:
        for single_key in ["sampleNameNormal", "sampleNameTumor"]:
            name = single_pair[single_key]
            if name not in samples_mapped:
                mapping_file_data += name + "\t" + \
                    os.path.join("Some/really/cool/path", name) + "\n"
                samples_mapped.append(name)
    return mapping_file_data


def create_data_clinical(pair_info):
    clinical_file_data = "Sample ID\tRequest ID\tAssay\tLab Head Name\tLab Head Email\n"
    for single_pair in pair_info['pairs']:
        clinical_file_data += single_pair["sampleNameTumor"] + "\t" + single_pair["igoRequestId"] + "\t" + \
            single_pair["assay"] + "\t" + single_pair["labHeadName"] + \
            "\t" + single_pair["labHeadEmail"] + "\n"
    return clinical_file_data


def create_correct_pair(job_pair):
    normal_sample = set()
    tumor_sample = set()
    correct_pairs = []
    for single_pair in job_pair["pairs"]:
        normal_sample_name = single_pair["sampleNameNormal"]
        tumor_sample_name = single_pair["sampleNameTumor"]
        if normal_sample_name in tumor_sample:
            normal_sample_name = "{}_{}".format(
                normal_sample_name, random.randint(0, 100))
        if normal_sample_name not in normal_sample:
            normal_sample.add(normal_sample_name)
        if tumor_sample_name in normal_sample:
            tumor_sample_name = "{}_{}".format(
                tumor_sample_name, random.randint(0, 100))
        if tumor_sample_name not in tumor_sample:
            tumor_sample.add(tumor_sample_name)
        single_pair["sampleNameNormal"] = normal_sample_name
        single_pair["sampleNameTumor"] = tumor_sample_name
        correct_pairs.append(single_pair)
    job_pair["pairs"] = correct_pairs
    return job_pair


def create_sample_files(job_pair):
    correct_pair = create_correct_pair(job_pair)
    pair_file = create_pairing_file(correct_pair)
    samples = {}
    for single_pair in correct_pair["pairs"]:
        sample = copy.deepcopy(single_pair)
        tumor_sample_name = sample.pop("sampleNameTumor")
        normal_sample_name = sample.pop("sampleNameNormal")
        if normal_sample_name not in samples:
            normal_sample_file = copy.deepcopy(sample)
            normal_sample_file["tumorOrNormal"] = "Normal"
            normal_sample_file["path"] = os.path.join(
                "Some/really/cool/path", normal_sample_name)
            normal_sample_file["paired_with"] = [tumor_sample_name]
            samples[normal_sample_name] = normal_sample_file
        else:
            normal_sample_pairs = samples[normal_sample_name]["paired_with"]
            if tumor_sample_name not in normal_sample_pairs:
                normal_sample_pairs.append(tumor_sample_name)
        if tumor_sample_name not in samples:
            tumor_sample_file = copy.deepcopy(sample)
            tumor_sample_file["tumorOrNormal"] = "Tumor"
            tumor_sample_file["path"] = os.path.join(
                "Some/really/cool/path", tumor_sample_name)
            tumor_sample_file["paired_with"] = [normal_sample_name]
        else:
            tumor_sample_pairs = samples[tumor_sample_name]["paired_with"]
            if normal_sample_name not in tumor_sample_pairs:
                tumor_sample_pairs.append(normal_sample_name)
    return samples


def main():
    pair_info = get_pair_info()
    for single_job_group in pair_info:
        job_pair = pair_info[single_job_group]
        samples = create_sample_files(job_pair)
        #pair_file = create_pairing_file(job_pair)
        # print(samples)
        #mapping_file = create_mapping_file(job_pair)
        #data_clinical = create_data_clinical(job_pair)
        payload = {"uuid": single_job_group, "job_files": [samples]}
        submit = requests.post(JOB_MODEL_URL, json=payload)
        print(submit.text)
        # print(pair_file)
        # print(mapping_file)
        # print(data_clinical)


if __name__ == "__main__":
    main()
