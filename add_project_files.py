import os
import json
import requests
from requests.auth import HTTPBasicAuth


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


def main():
    pair_info = get_pair_info()
    for single_job_group in pair_info:
        job_pair = pair_info[single_job_group]
        pair_file = create_pairing_file(job_pair)
        mapping_file = create_mapping_file(job_pair)
        data_clinical = create_data_clinical(job_pair)
        payload = {"uuid": single_job_group, "job_files": [
            pair_file, mapping_file, data_clinical]}
        submit = requests.post(JOB_MODEL_URL, json=payload)
        print(submit.text)
        # print(pair_file)
        # print(mapping_file)
        # print(data_clinical)


if __name__ == "__main__":
    main()
