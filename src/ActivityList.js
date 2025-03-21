import { useEffect } from "react";
import "./ActivityList.css"
function ActivityList() {
    var items = [];
    
    useEffect(() => {
        // localStorage.clear();
        console.log("stroke");
        items = JSON.parse(localStorage.getItem("activities-list"));
        console.log(items)
        
    }, [])
    
    return (
        <div id="ActivityList">
            <h3>Activities</h3>
            <div id="activity-list-view">
                <p id="empty-list-text">(empty)</p>
            </div>
        </div>
    );
}
export default ActivityList;