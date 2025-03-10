import { useEffect, useRef, useState } from "react";
function CreateActivity() {
    const [activitiesInput, setActivitiesInput] = useState([{index: 0, input: ""}]);
    const [focusInput, setFocusInput] = useState(0);
    const [checkFocus, setCheckFocus] = useState(false);
    const handleKeyPress = (event) => {
        console.log("event target: " + event.target.id + "\n and focusinput: " + "activity-input-"+focusInput)
        console.log("chekcheckFocus");
        if (checkFocus) {
            console.log("checking focus");
            console.log("if statement parts " + event.target.id + " " + "activity-input-"+focusInput)
            if (event.target.id != "activity-input-"+focusInput) {
                console.log("switching focus to " + focusInput);
                document.getElementById("activity-input-"+focusInput).setSelectionRange(0, 0);
            }
            setCheckFocus(false);
        }
        //document.getElementById("activity-input-"+(activitiesInput[activitiesInput.length-1].focusInput)).focus()
        if (event.key == "Enter") {
            console.log("current focus input" + event.target.id[event.target.id.length - 1]);
            console.log("activities input " + activitiesInput[activitiesInput.length-1].index);
            setCheckFocus(true);
            console.log("if statement check pressing enter");
            console.log(Number(event.target.id[event.target.id.length - 1]))
            console.log(activitiesInput[activitiesInput.length-1].index)
            if (Number(event.target.id[event.target.id.length - 1]) == activitiesInput[activitiesInput.length-1].index) {
                setActivitiesInput(prevState => [...prevState, {index: activitiesInput[activitiesInput.length-1].index+1, input: ""}]);
                console.log("setting focus to " + activitiesInput[activitiesInput.length - 1].index+1)
                setFocusInput(activitiesInput[activitiesInput.length - 1].index+1);
            } else {
                console.log("setting focus to " + (focusInput+1))
                setFocusInput(focusInput+1)
            }
            console.log("checking getting element from id" + document.getElementById("activity-input-"+(activitiesInput[activitiesInput.length-1].index+1)))
        }
        //if (event.key=="")
    }
    //setActivitiesInput([<input type="text" onKeyDown={handleKeyPress}/>])
    return (
        <div>
            <h1>Create Activity</h1>
            <form>
                <label htmlFor="activity-name">Name:</label>
                <input type="text" id="activity-name" name="activity-name" key={0}/>
                <div>
                    {activitiesInput.map((item) =>
                        <input id={"activity-input-" + item.index} key={item.index} onKeyDown={handleKeyPress} defaultValue={item.input} type="text"/>
                    )}
                </div>
            </form>
        </div>
    );
}

export default CreateActivity;