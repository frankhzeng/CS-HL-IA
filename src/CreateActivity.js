import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function CreateActivity() {
    const [activitiesInput, setActivitiesInput] = useState([{index: 0, input: "", minutes: 0}]);
    const [focusInput, setFocusInput] = useState(0);
    const [isName, setIsName] = useState(true);
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
    const handleSubmitPress = (event) => {
        console.log(JSON.stringify(activitiesInput));
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
        setActivitiesInput(prevState => {
            let before = prevState.slice(0, eventTargetID);
            let current = {index: eventTargetID, input: inputValue, minutes: minutesValue}
            let after = prevState.slice(eventTargetID+1, prevState.length)
            if (eventTargetID === 0) {
                if (prevState.length - eventTargetID - 1 === 0) {
                    return [current]
                }
                return [current, ...after]
            }
            return [...before, current, ...after]
        })
        if (event.key === "Backspace") {
            console.log(eventTargetID, " ", isName, " ", inputValue.length, " ", minutesValue.length);
            if (eventTargetID !== 0 && inputValue.length === 0) {
                console.log(activitiesInput.slice(0, focusInput));
                console.log(activitiesInput.slice(focusInput, activitiesInput.length));
                setFocusInput(prevState => prevState - 1);
                setIsName(false);
            }
            if (!isName && minutesValue.length === 0) {
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
    return (
        <div>
            <h1>Create Activity</h1>
            <form>
                <input type="text" id="create-activity-name" name="activity-name"/>
                <div id="activity-input-container">
                    {activitiesInput.map((item) =>
                        <div>
                            <input 
                                id={"activity-input-" + item.index} 
                                key={crypto.randomUUID()} 
                                onFocus={handleOnFocus} 
                                onKeyDown={handleKeyPress} 
                                defaultValue={item.input} 
                                type="text"
                            />
                            <input 
                                id={"activity-input-minutes-" + item.index} 
                                onKeyDown={handleKeyPress} 
                                onFocus={handleOnFocus} 
                                type="number" 
                                key={crypto.randomUUID()} 
                                defaultValue={item.minutes}
                            />
                        </div>
                    )}
                </div>
                <Link onClick={handleSubmitPress}>Submit</Link>
            </form>
        </div>
    );
}

export default CreateActivity;