import { useRef, useState, useEffect } from 'react'
import './CompleteActivity.css'
function CompleteActivity() {
    const tasksRef = useRef([]);
    var activity = JSON.parse(localStorage.getItem("in-progress-activity"))
    var list_from_json = JSON.parse(activity.tasks);
    const [taskList, setTaskList] = useState(list_from_json);
    const secondsToMinutes = (seconds) => {
        return Math.floor(seconds/60) + ":" + ((seconds % 60).toString().length === 1 ? "0" : "") + (seconds % 60);
    }
    useEffect(() => {
        console.log(list_from_json);
        setInterval(() => { updateTimer() }, 1000); 
    }, [])

    useEffect(() => {
        console.log("taskList: ", taskList);
    }, [taskList])
    const updateTimer = () => {
        console.log("updating timer")
        setTaskList((prevState) => {
            return prevState.map((item) => {
                return {index: item.index, input: item.input, total_minutes: item.total_minutes, elapsed_seconds: item.elapsed_seconds+(item.isFocused), isFinished: ((item.elapsed_seconds+1) >= item.total_minutes * 60), isFocused: item.isFocused}
            })
        })
    }
    
    const setFocus = (focusIndex) => {
        setTaskList((prevState) => {
            return prevState.map((item, index) => {
                return {index: item.index, input: item.input, total_minutes: item.total_minutes, elapsed_seconds: item.elapsed_seconds, isFinished: item.isFinished, isFocused: (index === focusIndex ? true : false)}
            })
        })
    }
    const removeFocus = () => {
        setTaskList((prevState) => {
            return prevState.map((item, index) => {
                return {index: item.index, input: item.input, total_minutes: item.total_minutes, elapsed_seconds: item.elapsed_seconds, isFinished: item.isFinished, isFocused: false}
            })
        })
    }
    const finishTask = (finishIndex) => {
        console.log("finish index ", finishIndex);
        for (var i = 0; i < taskList.length; i++) {
            let item = taskList[i];
            console.log(item);
            if (!item.isFinished) {
                console.log("set foucs to ", item.index)
                setFocus(item.index);
                break;
            }
        }
    }
    const setFocusCSS = () => {
        for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].isFocused) {
                tasksRef.current[i].className = 'focused';
                console.log(tasksRef.current[i])
            }
        }
    }
    return (
    <div>
        <h1>Activity In Progress</h1>
        <h3>Name: {activity.name}</h3>
        <p>{activity.description}</p>
        <button onClick={() => setFocusCSS()}>Run Function</button>
        <div>
            {taskList.map((item, index) => {
                return <div id="complete-activity-task-container" key={index} ref={(el) => {(tasksRef.current[index] = el); return el}}>
                    <p id="complete-activity-task-name">{item.input}</p>
                    <p id="complete-activity-task-timer">{secondsToMinutes(item.elapsed_seconds)} / {item.total_minutes}:00</p>
                    <button onClick={() => { setFocus(item.index); }}>Start/Resume this Task</button>
                    <button onClick={removeFocus}>Stop Task</button>
                    <button onClick={() => { finishTask(item.index) }}>Finish</button>
                </div>
            })}
        </div>
    </div>
    )
}
export default CompleteActivity