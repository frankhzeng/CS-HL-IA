import { useRef, useState } from 'react'
function CompleteActivity() {
    const tasksRef = useRef([]);
    const [activeTask, setActiveTask] = useState(0);
    var activity = JSON.parse(localStorage.getItem("in-progress-activity"))
    var list = JSON.parse(activity.tasks);
    console.log(activity);
    console.log(list);
    const secondsToMinutes = (seconds) => {
        return Math.floor(seconds/60) + ":" + (seconds % 60) + (toString(seconds % 60).length === 1 ? "" : "0");
    }
    
    return (
    <div>
        <h1>Activity In Progress</h1>
        <h3>Name: {activity.name}</h3>
        <p>{activity.description}</p>
        <div>
            {list.map((item, index) => {
                return <div id="complete-activity-task-container" key={index} ref={(el) => {(tasksRef.current[index] = el); return el}}>
                    <p id="complete-activity-task-name">{item.input}</p>
                    <p id="complete-activity-task-timer">{secondsToMinutes(item.elapsed_seconds)} / {item.total_minutes}:00</p>
                </div>
            })}
        </div>
    </div>
    )
}
export default CompleteActivity