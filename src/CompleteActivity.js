import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CompleteActivity.css'
function CompleteActivity() {
    const tasksRef = useRef([]);
    const finalScreenRef = useRef();
    const resultsPRef = useRef();
    var activity = JSON.parse(localStorage.getItem("in-progress-activity"))
    var list_from_json = JSON.parse(activity.tasks);
    const [taskList, setTaskList] = useState(list_from_json);
    const secondsToMinutes = (seconds) => {
        return Math.floor(seconds/60) + ":" + ((seconds % 60).toString().length === 1 ? "0" : "") + (seconds % 60);
    }
    useEffect(() => {
        setInterval(() => { updateTimer() }, 1000); 
    }, [])

    useEffect(() => {
        console.log("taskList: ", taskList);
        setFocusCSS();
    }, [taskList])
    function colorGradient(elapsed, total) {
        let fadeFraction = elapsed / total;
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
        setTaskList((prevState) => {
            return prevState.map((item) => {
                return {index: item.index, input: item.input, total_minutes: item.total_minutes, elapsed_seconds: item.elapsed_seconds+(item.isFocused * 10), isFinished: item.isFinished, isFocused: item.isFocused}
            })
        })
    }
    
    const setFocus = (focusIndex) => {
        tasksRef.current[focusIndex].style.borderColor = "#000000"
        setTaskList((prevState) => {
            return prevState.map((item, index) => {
                return {index: item.index, input: item.input, total_minutes: item.total_minutes, elapsed_seconds: item.elapsed_seconds, isFinished: item.isFinished && (index !== focusIndex), isFocused: (index === focusIndex ? true : false)}
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
    const changeFocusAndFinish = (focusIndex, finishIndex) => {
        console.log("chnagefocus and finsh: ", focusIndex, " ", finishIndex)
        setTaskList((prevState) => {
            return prevState.map((item, index) => {
                return {index: item.index, input: item.input, total_minutes: item.total_minutes, elapsed_seconds: item.elapsed_seconds, isFinished: item.isFinished || (item.index === finishIndex), isFocused: (index === focusIndex ? true : false)}
            })
        })
    }
    const finishTask = (finishIndex) => {
        console.log("finish index ", finishIndex);
        tasksRef.current[finishIndex].style.borderColor = "#00FF00"
        var fullyCompleted = true;
        for (var i = 0; i < taskList.length; i++) {
            if (i === finishIndex) continue;
            let item = taskList[i];
            console.log(item);
            if (!item.isFinished) {
                console.log("set foucs to ", item.index)
                changeFocusAndFinish(item.index, finishIndex);
                fullyCompleted = false;
                break;
            }
        }
        if (fullyCompleted) {
            //all of the tasks are finished
            setTaskList((prevState) => {
                return prevState.map((item, index) => {
                    return index === finishIndex ? {index: item.index, input: item.input, total_minutes: item.total_minutes, elapsed_seconds: item.elapsed_seconds, isFinished: true, isFocused: item.isFocused} : item
                })
            })
            removeFocus();
            finalScreenRef.current.style.display = "block";
            var completedOverTime = 0;
            for (var j = 0; j < taskList.length; j++) {
                if (taskList[j].elapsed_seconds >= taskList[j].total_minutes * 60) {
                    completedOverTime += 1;
                }
            }
            var color = "";
            let fraction = completedOverTime / taskList.length;
            if (fraction <= 0.50) {
                fraction = fraction / 0.50
                color = "#" + rgbToHex(Math.floor(255 * fraction)) + rgbToHex(255) + rgbToHex(0);
            } else {
                fraction = (fraction - 0.50) / 0.50;
                color = "#" + rgbToHex(255) + rgbToHex(Math.floor(255 - (255 * fraction))) + rgbToHex(0);
            }
            console.log("COLOR: ", color);
            finalScreenRef.current.style.backgroundColor = color + "80";
            console.log( completedOverTime);
            resultsPRef.current.textContent = "You completed " + (taskList.length - completedOverTime) + " out of " + taskList.length + " tasks in time.";
        }
    }
    const setFocusCSS = () => {
        for (var i = 0; i < taskList.length; i++) {
            let elapsed = taskList[i].elapsed_seconds;
            let total = taskList[i].total_minutes * 60;
            let css = "linear-gradient(to right, " + colorGradient(elapsed, total) + " 0% " + Math.floor(100 * elapsed/total) + "%, transparent " + Math.floor(100 * elapsed/total) + "% 100%)"
            tasksRef.current[i].style.background = css;
            if (taskList[i].isFocused) {
                tasksRef.current[i].className = 'focused';
            } else {
                tasksRef.current[i].className = "";
            }
        }
    }
    const handleResume = () => {
        console.log("working?");
        removeFocus();
        finalScreenRef.current.style.display = "none";
    }
    const portToHome = (event) => {
        // localStorage.clear();
        let totalList = localStorage.getItem("activities-list");
        console.log(totalList);
        //get fraction of completed tasks on time
        var completedOverTime = 0;
        for (var j = 0; j < taskList.length; j++) {
            if (taskList[j].elapsed_seconds >= taskList[j].total_minutes * 60) {
                completedOverTime += 1;
            }
        }
        var color = "";
        let fraction = completedOverTime / taskList.length;
        if (fraction <= 0.50) {
            fraction = fraction / 0.50
            color = "#" + rgbToHex(Math.floor(255 * fraction)) + rgbToHex(255) + rgbToHex(0);
        } else {
            fraction = (fraction - 0.50) / 0.50;
            color = "#" + rgbToHex(255) + rgbToHex(Math.floor(255 - (255 * fraction))) + rgbToHex(0);
        }

        console.log( completedOverTime);
        if (!totalList) {
            localStorage.setItem("activities-list", JSON.stringify([{name: activity.name, description: activity.description, tasks: JSON.stringify(taskList), color: color}]))
            console.log("going");
        } else {
            console.log(totalList);
            let parsedList = JSON.parse(totalList);
            console.log(parsedList);
            parsedList = [...parsedList, {name: activity.name, description: activity.description, tasks: JSON.stringify(taskList), color: color}]
            console.log(parsedList);
            localStorage.setItem("activities-list", JSON.stringify(parsedList));
            // event.preventDefault()
        }
    }
    return (
    <div>
        <h1>Activity In Progress</h1>
        <h3>Name: {activity.name}</h3>
        <p>{activity.description}</p>
        <div>
            {taskList.map((item, index) => {
                return <div id="complete-activity-task-container" key={index} ref={(el) => {(tasksRef.current[index] = el); return el}}>
                    <p id="complete-activity-task-name">{item.input}</p>
                    <p id="complete-activity-task-timer">{secondsToMinutes(item.elapsed_seconds)} / {item.total_minutes}:00</p>
                    <button onClick={() => { setFocus(item.index); }}>▶️</button>
                    <button onClick={removeFocus}>⏹️</button>
                    <button onClick={() => { finishTask(item.index) }}>✔️</button>
                </div>
            })}
        </div>
        <div ref={finalScreenRef} id="all-tasks-finished-screen">
            <h1>You're Finished!</h1>
            <p ref={resultsPRef}>placeholder</p>
            <button onClick={handleResume}>Resume</button>
            <button onClick={portToHome}>;kdsjfLKJF:LKDSJF:LKSJF:LKDSJF:Lk</button>
            <Link onClick={portToHome} id="complete-activity-home" to="/">Home</Link>
        </div>
    </div>
    )
}
export default CompleteActivity