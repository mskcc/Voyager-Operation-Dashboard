// import ReactScrollableList from 'react-scrollable-list/dist/index'

function ScrollList ({listItems}) {
   return(
    <>
    <ul style={{listStyleType: 'none'}}>
        {listItems.map((item, index) => {
            return (
                <li key={index}>{item}</li>
            )
        })}
    </ul>
    </>
   )
}

export default ScrollList