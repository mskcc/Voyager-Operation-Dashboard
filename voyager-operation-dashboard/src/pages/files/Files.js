import { useState, useEffect } from "react";
import LinearIndeterminate from "../../components/loaders/LinearIndeterminate";
import { beagle_get } from "../../components/common/Beagle";

function Files() {
  const [filesData, setFilesData] = useState();

  beagle_get("/v0/fs/files")
    .then((r) => r.data)
    .then((data) => setFilesData(data));

  if (filesData) {
    return (
      <div>
        <h1>Count: {filesData.count}</h1>
      </div>
    );
  } else {
    return (
      <div>
        <LinearIndeterminate />
      </div>
    );
  }
}

export default Files;
