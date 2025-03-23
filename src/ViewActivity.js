import { useEffect } from "react";
import { useLocation } from "react-router-dom"

function ViewActivity() {
    const location = useLocation();
    const item = location.state;
    useEffect(() => {
        console.log(item);
    }, [])
    return <div>
        <p></p>
    </div>
}
export default ViewActivity