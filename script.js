const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2305-FTB-ET-WEB-PT';
// Use the API_URL variable for fetch requests
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${API_URL}/players`)
        const players = await response.json()
        console.log(players)
        return players
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
}; // TYLER

const fetchSinglePlayer = async (playerId) => {
    try {
        //Fetch single player
        const response = await fetch(`${API_URL}/players/${playerId}`)
        const player = await response.json()
        const playerElement = document.createElement('div')
        console.log(player.data.player) //ADDED, UNSURE IF NEEDED-LN
        return player.data.player

        //Render single player
        // playerElement.classList.add("player")
        // playerElement.innerHTML = `<h4>${player.name}</h4> <p>${player.breed}</p> <p>${player.status}</p> <p>${player.imageURL}</p>`
        // playerContainer.appendChild(playerElement)
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
}; // TYLER

//POST new player
const addNewPlayer = async (id, name, breed, status, imageUrl, teamID, cohortID) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({id, name, breed, status, imageUrl, teamID, cohortID}),
            headers: {
            "Content-Type": "application/json"}
        });
        const player = await response.json();
        console.log(player);
        fetchAllPlayers();
        
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
}; // LAURA

//DELETE PLAYER
const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${API_URL}/players/${playerId}`, {
            method: "DELETE",
          }); 
          const player = await response.json();
          fetchAllPlayers();
          //reload window
          window.location.reload();
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        ); // LAURA
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    if (!playerList || playerList.length === 0) {
        playerContainer.innerHTML = "<h3>No players found</h3>";
        return
    }
    try {
        playerContainer.innerHTML = ''
            Object.keys(playerList.data.players).forEach((player) => {
            // const playerList1 = Array.from(playerList);
            // playerList1.forEach((player) => {
            const playerData = playerList.data.players
            const playerElement = document.createElement('div')
            playerElement.classList.add("player-card")
            playerElement.innerHTML = `
            <h2>${playerList.data.players[player]['name']}</h2>
            <p>${playerList.data.players[player]['breed']}</p>
            <p>${playerList.data.players[player]['status']}</p>
            <img src="${playerList.data.players[player]['imageUrl']}">
            <button class="details-button" data-id="${playerList.data.players[player]['id']}">See Details</button>
            <button class="delete-button" data-id="${playerList.data.players[player]['id']}">Delete</button>
            `
        playerContainer.appendChild(playerElement)

        const detailsButton = playerElement.querySelector('.details-button')
        const id = playerList.data.players[player]['id']
        detailsButton.addEventListener('click', async (event) => {
            
            event.preventDefault()
            // const id = playerList.data.players[player]['id']
            console.log(id);
            const player = await fetchSinglePlayer(id)
            // fetchSinglePlayer(id)
            renderSinglePlayer(player)
        });

        const deleteButton = playerElement.querySelector('.delete-button')
        // const id1 = playerList.data.players[player]['id']
        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault()
            const id1 = playerList.data.players[player]['id']
            removePlayer(id1)
        })
        })
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }}

const renderSinglePlayer = (player) => {
    // if (!player || player.length === 0) {
    //     playerContainer.innerHTML = "<h3>No player found</h3>";
    //     return;
    //   }
      let playerHTML = `
      <div class="single-player-view">
        <div class="player">
      <h4>${player.name}</h4>
      <img src="${player.imageUrl}" alt="${player.name}">
      <p>${player.breed}</p>
      <p>${player.status}</p>
    </div>

    <button class="back-button">Back</button>
  </div>
    `;
    playerContainer.innerHTML = playerHTML
    let backButton = playerContainer.querySelector('.back-button')
    backButton.addEventListener('click', async () => {
        const players = await fetchAllPlayers()
        renderAllPlayers(players)
    })
}

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
   
        let formHTML = `
    <form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Name">

        <label for="breed">Breed</label>
        <input type="text" id="breed" name="breed" placeholder="Breed">
    
        <label for="status">Status</label>
        <input type="status" id="status" name="status" placeholder="Status">

        <label for="imageUrl">Image URL</label>
        <input type="text" id="imageUrl" name="imageUrl" placeholder="Image URL">

        <button type="submit">Create</button>
    </form>
        `;

    newPlayerFormContainer.innerHTML = formHTML;
  // add event listener
  let form = newPlayerFormContainer.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let playerData = {
      name: form.name.value,
      breed: form.breed.value,
      status: form.status.value,
      imageUrl: form.imageUrl.value,
    };

    await createNewPlayer(
      playerData.name,
      playerData.breed,
      playerData.status,
      playerData.imageUrl,
    );

    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    form.name.value = "";
    form.breed.value = "";
    form.status.value = "";
    form.imageUrl.value = "";
  });
    };

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();