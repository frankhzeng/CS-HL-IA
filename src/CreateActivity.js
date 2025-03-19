import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './CreateActivity.css'
function CreateActivity() {
    const [activitiesInput, setActivitiesInput] = useState([{index: 0, input: "", minutes: 5}]);
    const [focusInput, setFocusInput] = useState(0);
    const [isName, setIsName] = useState(true);
    const textAreaRef = useRef()
    const noNameWarningRef = useRef();
    const noTaskWarningRef = useRef();
    useEffect(() => {
        var lastEditedElement = document.getElementById("activity-input-" + (isName? "" : "minutes-") + focusInput)
        lastEditedElement?.focus();
    }, [activitiesInput, focusInput, isName])
    const handleOnFocus = (event) => {
        let eventIDNumber = (Number(event.target.id[event.target.id.length - 1]))
        if (event.target.id === "activity-input-minutes-" + eventIDNumber) {
            setIsName(false)
        } else {
            setIsName(true)
        }
        setFocusInput(eventIDNumber)
    }
    const handleKeyPress = (event) => {
        let eventTargetID = Number(event.target.id[event.target.id.length - 1]);
        let inputValue;
        let minutesValue;
        if (!isName) {
            minutesValue = event.target.value;
            inputValue = document.getElementById("activity-input-"+ eventTargetID).value
        } else {
            inputValue = event.target.value;
            minutesValue = document.getElementById("activity-input-minutes-" + eventTargetID).value;
        }
        if (inputValue !== activitiesInput[focusInput].input || minutesValue !== activitiesInput[focusInput].minutes) {
            setActivitiesInput(prevState => {
                let before = prevState.slice(0, eventTargetID);
                let current = {index: eventTargetID, input: inputValue, minutes: removeLeadingZeros(minutesValue)}
                let after = prevState.slice(eventTargetID+1, prevState.length)
                if (eventTargetID === 0) {
                    if (prevState.length - eventTargetID - 1 === 0) {
                        return [current]
                    }
                    return [current, ...after]
                }
                return [...before, current, ...after]
            })
        }
        if (event.key === "Backspace") {
            if (eventTargetID !== 0 && inputValue.length === 0) {
                event.preventDefault();
                setActivitiesInput(prevState => {
                    let before = prevState.slice(0, focusInput);
                    let after = prevState.slice(focusInput+1, prevState.length);
                    after = after.map(item => {return {index: item.index-1, input:item.input, minutes:item.minutes}});
                    if (before.length === 0 && after.length === 0) return [{index: 0, input: "", minutes: 0}]; //theoretically can't happen but just in case
                    else if (before.length === 0) return [...after]
                    else if (after.length === 0) return [...before]
                    else return [...before, ...after]
                })
                setIsName(false);
                setFocusInput(prevState => prevState - 1);
            }
            if (!isName && minutesValue.length === 0) {
                event.preventDefault();
                setIsName(true);
            }
        }
        if (event.key === "Enter") {
            let lastIndex = Number(activitiesInput[activitiesInput.length-1].index)
            if (eventTargetID === lastIndex && !isName) {
                setActivitiesInput(prevState => [...prevState, {index: lastIndex+1, input: ""}]);
                setFocusInput(lastIndex+1);
                setIsName(true)
            } else {
                if (isName) {
                    setIsName(false)
                } else {
                    setFocusInput(eventTargetID + 1)
                    setIsName(true)
                }
            }
        }
    }
    const textAreaOnInputHandler = (event) => {
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 3 + "px";
        textAreaRef.current.style.height = "";
    }
    const removeLeadingZeros = (str) => {
        var i = 0;
        while (str[i] === "0") {
            i++;
        }
        return str.slice(i, str.length);
    }
    const handleSubmitPress = (event) => {
        noNameWarningRef.current.style.display = "none";
        noNameWarningRef.current.style.visibility = "hidden";
        noTaskWarningRef.current.style.display = "none";
        noTaskWarningRef.current.style.visibility = "hidden";
        if (document.getElementById("create-activity-name").value.length === 0) {
            noNameWarningRef.current.style.display = "block";
            noNameWarningRef.current.style.visibility = "visible";
            event.preventDefault();
        }
        for (var i = 0; i < activitiesInput.length; i++) {
            if (activitiesInput[i].input.length === 0 || typeof activitiesInput[i].minutes === "undefined" || activitiesInput[i].minutes === "") {
                noTaskWarningRef.current.style.display = "block";
                noTaskWarningRef.current.style.visibility = "visible";
                event.preventDefault();
                break;
            }
            
        }
        localStorage.setItem("in-progress-activity", JSON.stringify(
            {name: document.getElementById("create-activity-name").value,
            description: textAreaRef.current.value,
            tasks: JSON.stringify(activitiesInput.map((item) => {
               return {index: item.index, input: item.input, total_minutes: removeLeadingZeros(item.minutes), elapsed_seconds: 0, isFinished: false, isFocused: (item.index === 0 ? true : false)}
            }))}))
    }
    return (
        <div>
            <h1>Create Activity</h1>
            <form>
                <div className="create-activity-flex-div">
                    <div className="activity-static-input-container">
                        <label>Name</label>
                        <input type="text" id="create-activity-name" name="activity-name"/>
                    </div>
                    <div className="activity-static-input-container">
                        <label>Description</label>
                        <textarea ref={textAreaRef} id="create-activity-description" onInput={textAreaOnInputHandler}></textarea>
                    </div>
                    <div id="activity-input-container">
                        {activitiesInput.map((item) =>
                            <div className="flex-activity-container">
                                <div className="activity-input-container">
                                    <label>Task Name</label>
                                    <input 
                                        id={"activity-input-" + item.index} 
                                        key={crypto.randomUUID()} 
                                        onFocus={handleOnFocus} 
                                        onKeyUp={handleKeyPress} 
                                        defaultValue={item.input} 
                                        type="text"
                                    />
                                </div>
                                <div className="activity-input-container">
                                    <label>Task Time (minutes)</label>
                                    <input 
                                        id={"activity-input-minutes-" + item.index} 
                                        onKeyUp={handleKeyPress} 
                                        onFocus={handleOnFocus} 
                                        type="number" 
                                        key={crypto.randomUUID()} 
                                        defaultValue={item.minutes}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="create-activity-incomplete-warning" ref={noNameWarningRef}>Please enter a name for this activity.</p>
                    <p className="create-activity-incomplete-warning" ref={noTaskWarningRef}>Please enter both the task name and duration.</p>
                    <Link id="create-activity-submit" onClick={handleSubmitPress} to="/complete">Submit</Link>
                    </div>
            </form>
        </div>
    );
}

export default CreateActivity;