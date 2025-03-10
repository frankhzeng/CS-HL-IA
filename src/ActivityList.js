function ActivityList() {
    var items = [
        {key: "1", text: "abc"}, 
        {key: "2", text: "dfsdashrhafd"}
      ];
    
    return (
        <div id="ActivityList">
            <h3>Activities</h3>
            <div>
                <ul>
                    <li>placeholder 2</li>
                    <li>placeholder</li>
                    {items.map((item) => {
                        return <li key={item.key}>{item.text}</li>
                    })}
                </ul>
            </div>
        </div>
    );
}
export default ActivityList;