import logo from './logo.svg';
import './App.css';
import { db } from "./firebase/firebase";
import { onValue, ref, update } from "firebase/database";
import React, { Suspense, useEffect, useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);
  const [sortByEndTime, setSortByEndTime] = useState(false); // State to track sorting by end time or score
  const [EditPage, setEditPage] = useState(false); // State to track sorting by end time or score
  const [CurrentPlayer, setCurrentPlayer] = useState(""); // State to track sorting by end time or score
  const [PlayerToAdd, setPlayerToAdd] = useState("Player1"); // State to track sorting by end time or score
  const [NewPlayerName, setNewPlayerName] = useState("");
  const [Password, setPassword] = useState("");
  const [ShowPasswordModal, setShowPasswordModal] = useState(false);
  const [AdminPassword, setAdminPassword] = useState(""); // State to store the admin password fetched from the database


  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    milliseconds %= 1000 * 60 * 60;
    const minutes = Math.floor(milliseconds / (1000 * 60));
    milliseconds %= 1000 * 60;
    const seconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;

    // Pad each component with leading zeros if necessary
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    const paddedMilliseconds = String(ms).padStart(3, '0');

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  const formatDuration = (duration) => {
    return duration / 1000;
  };

  useEffect(() => {
    const query = ref(db);
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        const players = data.players;
        setCurrentPlayer(data.current_player);
        setAdminPassword(data.password);


        // Convert object into an array of players
        const playersArray = Object.keys(players).map((key) => ({
          id: key,
          ...players[key]
        }));

        // Filter out players without time
        const filteredPlayers = playersArray.filter(player => player.time);

        // Sort and assign rank
        let sortedPlayers = filteredPlayers.sort((a, b) => a.time - b.time);
        sortedPlayers.forEach((player, index) => {
          player.rank = index + 1; // Add 1 because rank starts from 1, not 0
        });

        // Sort the players based on sort criteria
        sortedPlayers = sortByEndTime ?
          filteredPlayers.sort((a, b) => b.end - a.end) :
          filteredPlayers.sort((a, b) => a.time - b.time);

        // Set state with sorted and formatted players
        setPlayers(sortedPlayers);
      }
    });
  }, [sortByEndTime]); // Update effect when sortByEndTime changes

  const handleSortChange = () => {
    setSortByEndTime(!sortByEndTime); // Toggle sorting criteria
  }

  const handleEditChange = () => {
    if (EditPage) {
      setEditPage(!EditPage); // Toggle sorting criteria
    }
    else {
      setShowPasswordModal(!ShowPasswordModal);
    }
  }

  const handlePasswordSubmit = () => {
    if (Password === AdminPassword) {
      // Passwords match, allow access to admin page
      setEditPage(true);
      setShowPasswordModal(false); // Hide the password modal
    } else {
      // Passwords don't match, display an error message or handle accordingly
      alert("Incorrect password. Please try again.");
    }
  }

  const handleAdd = () => {
  }
  const handleEditSave = () => {
    if (NewPlayerName.trim() !== "") {
      update(ref(db), { current_player: NewPlayerName })
        .then(() => {
          setCurrentPlayer(NewPlayerName);
          setNewPlayerName("");
        })
        .catch(error => console.error("Error updating player name: ", error));
    }
  }


  return (
    <div className="App">
      {EditPage === false ?
        <main>
         {ShowPasswordModal && (
            <div className="password-modal">
            <div className="modal-content">
              <h2>Enter Admin Password</h2>
              <input
                type="password"
                placeholder="Enter password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="submit-btn" onClick={handlePasswordSubmit}>Submit</button>
              <button className="close-btn" onClick={handleEditChange}>Close</button>
            </div>
          </div>
          
          )}
          <div id="header">
            <h1>Ranking</h1>
            <div className="buttons">
              <button className="share" onClick={handleEditChange}>
                <i className="ph ph-pen"></i>
              </button>
              <button className="share" onClick={handleSortChange}>
                <i className={sortByEndTime ? "ph ph-crown-simple" : "ph ph-clock-counter-clockwise"}></i>
              </button>

            </div>
          </div>
          <div id="leaderboard">
            {/* <div className="ribbon"></div> */}
            <table>
              {/* <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Duration</th>
              </tr>
            </thead> */}
              <tbody>
                <tr></tr>
                <tr>
                  <td className="column">Rank</td>
                  <td className="column">Name</td>
                  <td className="column">End Time</td>
                  <td className="column">Duration</td>
                </tr>
                {players.map((player, index) => (
                  <tr key={player.id}>
                    <td className="number">{player.rank}</td>
                    <td className="name">{player.name}</td>
                    <td className="end">{formatTime(player.end)}</td>
                    <td className="points">
                      {formatDuration(player.time)}
                      {(player.rank === 1) && (
                        <img
                          className="gold-medal"
                          src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true"
                          alt="gold medal"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        :
        <main>
         
          <div id="header">
            <h1>Admin</h1>
            <div className="buttons">
              <button className="share" onClick={handleEditChange}>
                <i className="ph ph-arrow-left"></i>
              </button>

            </div>
          </div>
          <div id="leaderboard">
            {/* <div className="ribbon"></div> */}
            <table>
              {/* <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Duration</th>
            </tr>
          </thead> */}
              <tbody>
                <tr></tr>

                <tr>
                  <td className="points">Current Player</td>
                  <td className="name">
                    {CurrentPlayer}
                  </td>
                </tr>
                <tr>
                  <td className="points">Set Player</td>
                  <td className="name">
                    <input
                      type="text"
                      value={NewPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="share" onClick={handleEditSave}>
                      Save
                    </button>
                  </td>
                </tr>



              </tbody>
            </table>
          </div>
        </main>

      }
    </div>
  );
}

export default App;
