import { useEffect, useState} from "react"
import RunAllocationBtn from "../components/RunAllocateBtn"
import { getAllocation, getExport } from "../api/allocation"

export default function AllocationPage() {
    const [alloc, setAlloc] = useState([])

    const fetchAlloc = async () => {
        const res = await getAllocation()
        setAlloc(res.data)
    }
    useEffect(() => { fetchAlloc() }, [])

    return (
    <div className="container">
      <h2>Allocations</h2>
      <RunAllocationBtn onDone={fetchAlloc} />
      <button onClick={() => window.open(getExport(), '_blank')} style={{marginLeft:8}}>Export CSV</button>
      <table>
        <thead><tr><th>Room</th><th>Student Reg</th></tr></thead>
        <tbody>
          {alloc.map((a, i) => <tr key={i}><td>{a.room_name || a.room}</td><td>{a.student_reg}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}