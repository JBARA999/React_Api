import Login from "./components/Login";
import NotesList from "./components/NotesList";
import { useEffect, useState } from "react";

function App() {
  const [isConect, setisConect] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(
    ()=>{
      token ? setisConect(true):setisConect(false);
    },[token]
  )

  return (
    <div>{isConect ? <NotesList setisConect={setisConect}/> : <Login setisConect={setisConect} />}</div>
  );
}

export default App;
