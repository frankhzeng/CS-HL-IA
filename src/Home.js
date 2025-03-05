import { Link } from 'react-router-dom';
import ActivityList from './ActivityList'
function Home() {
    return (
        <div>
            <h1>Dashboard</h1>
            <Link to="/create">Create Activity</Link>
            <ActivityList/>
        </div>
    )
}
export default Home;