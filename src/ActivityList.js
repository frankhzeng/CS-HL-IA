import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./ActivityList.css"
function ActivityList() {
    var [items, setItems] = useState([]);
    const emptyListTextRef = useRef();
    const itemsRefs = useRef([]);
    useEffect(() => {
        // localStorage.clear();
        console.log("stroke");
        setItems(JSON.parse(localStorage.getItem("activities-list")) || []);
        console.log(items)
        emptyListTextRef.current.style.display = "none";
        if (items.length === 0) {
            console.log("??????");
            emptyListTextRef.current.style.display = "block";
        }
    }, [])
    useEffect(() => {
        for (var i = 0; i < items.length; i++) {
            itemsRefs.current[i].style.backgroundColor = items[i].color;
        }
    }, [items])
    return (
        <div id="ActivityList">
            <h3>Activities</h3>
            <div id="activity-list-view">
                <p id="empty-list-text" ref={emptyListTextRef}>(empty)</p>
                <button onClick={() => {localStorage.clear()}}>clear local storage</button>
                {console.log(items)}
                {items.map((item, index) => {
                    console.log(items);
                    return <Link key={crypto.randomUUID()} id="show-activity-cell" state={{item: item}} ref={(el) => {(itemsRefs.current[index] = el); return el}} to="/view">
                        <p id="activity-name-p">{item.name}</p>
                        <p>{item.description || "(none)"}</p>
                    </Link>
                })}
            </div>
        </div>
    );
}
export default ActivityList;