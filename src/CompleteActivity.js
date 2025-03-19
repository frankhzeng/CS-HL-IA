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
        setFocusCSS();
    }, [taskList])
    function colorGradient(elapsed, total) {
        let fadeFraction = elapsed / total;
        console.log("FADE GFRACCTION: ", elapsed, " / ", total, " ",  fadeFraction);
        if (fadeFraction > 1) return "#FF0000"
        var gradient;
        if (fadeFraction < 0.66) {
            gradient = {red: Math.round((255 * (fadeFraction / (2/3)))), green: 255, blue: 0}
        } else {
            gradient = {red: 255, green: Math.round(255 - (255 * ((fadeFraction-(2/3)) / (1/3)))), blue: 0}
        }
    
    
        return "#" + rgbToHex(gradient.red) + rgbToHex(gradient.green) + rgbToHex(gradient.blue);
    }
    const rgbToHex = (c) => {
        var h = c.toString(16);
        return h.length === 1 ? "0" + h : h;
    }
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
            let elapsed = taskList[i].elapsed_seconds;
            let total = taskList[i].total_minutes * 60;
            console.log(Math.floor(100 * elapsed/total));
            let css = "linear-gradient(to right, " + colorGradient(elapsed, total) + " 0% " + Math.floor(100 * elapsed/total) + "%, transparent " + Math.floor(100 * elapsed/total) + "% 100%)"
            console.log("style: ", css);
            tasksRef.current[i].style.background = css;
            if (taskList[i].isFocused) {
                tasksRef.current[i].className = 'focused';
                console.log(tasksRef.current[i])
            } else {
                tasksRef.current[i].className = "";
                console.log(tasksRef.current[i]);
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