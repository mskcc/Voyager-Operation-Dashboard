

function FileMenu({selectedFiles}) {
  // Need to separate the selectedFiles array into Material UI tabs
    return (
      <div style={{ height: 400, width: '100%' }}>
        <p>{selectedFiles}</p>
      </div>
    );
}

export default FileMenu