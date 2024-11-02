var wantedName = "Benjamin Netanyahu";
var bid = 0;
var participants = 0;
var ENDPOINT = 'https://wanted.toofanmisr.xyz'

function validateApplyForm() {
    // import axios from 'axios'
    document.getElementById('v3-submit-btn').setAttribute('disabled', 'true');

    var account = document.getElementById('v3-account-input').value;
    var walletAddress = document.getElementById('v3-walletAddress-input').value;
    var executionDate = document.getElementById('v3-executionDate-input').value;
    var details = document.getElementById('v3-details-input').value;
    var password = document.getElementById('v3-password-input').value;

    if(password.length < 6) {
        
        alert('Weak password.');
        document.getElementById('v3-submit-btn').removeAttribute('disabled');

        return false; // Prevent form submission
    }
    
    if(!executionDate && !details) {
        
        alert('Please enter Date or details.');
        document.getElementById('v3-submit-btn').removeAttribute('disabled');

        return false; // Prevent form submission
    }
    // console.log('account :', account)
    // console.log('walletAddress :', walletAddress)
    // console.log('executionDate :', executionDate)
    // console.log('details :', details)

    var payload = {
        wanted: wantedName,
        account,
        walletAddress,
        executionDate,
        details,
        password
    }

      submitApplyForm(payload);

  return false; // Prevent default form submission
}


function validateSubscribeForm(){
    document.getElementById('v2-submit-btn').setAttribute('disabled', 'true');
    var amount = document.getElementById('v2-amount-input').value;
    var account = document.getElementById('v2-account-input').value;
    var password = document.getElementById('v2-password-input').value;
    var fileInput = document.getElementById('v2-image');
    // console.log('password :', password)
    if(password.length < 6) {
        
        alert('Weak password.');
        document.getElementById('v2-submit-btn').removeAttribute('disabled');

        // return false; // Prevent form submission
    }
    var file = fileInput.files[0];
    var formData = new FormData();
    if(parseInt(amount) > 1000) {
        if (!file) {
            // console.log('No proof of funds provided')
            alert('Please provide a proof of funds.');
            document.getElementById('v2-submit-btn').removeAttribute('disabled');

            // return false; // Prevent form submission
        }
        else{
            
            // Construct the form data
            formData.append('wanted', wantedName);
            formData.append('amount', amount);
            formData.append('account', account);
            formData.append('password', password);
            formData.append('photo', file);
            submitForm(formData);
            
        }
        
    }
    else{
        formData.append('wanted', wantedName);
        formData.append('amount', amount);
        formData.append('account', account);
        formData.append('password', password);

        submitForm(formData);
    }

    
    // var form = document.getElementById('v2-form');
    // form.action = `${ENDPOINT}/addparticipant`;


  return false; // Prevent default form submission
}

async function submitForm(formData) {
    var endpoint = `${ENDPOINT}/addparticipant`; // Replace with the actual value
  
    try{
        const response = await axios.post(endpoint, formData)
        if(formData.amount > 1000) {
            alert('Your subscription is under review.');
        }
        else{
            alert('You have subscribed successfully!.');

        }

    }
    catch(e) {
        console.log('error :', e)
    }
    document.getElementById('v2-submit-btn').removeAttribute('disabled');

  }


async function submitApplyForm(payload) {
    // console.log('payload :', JSON.stringify(payload))
    var endpoint = `${ENDPOINT}/addhunter`; // Replace with the actual value
    // Use AJAX or other methods to submit the form data to the server
    // For example, using fetch:
    try{
        const response = await axios.post(endpoint, {
            ...payload
        })
            // console.log('res :', response)
            alert(response.data);
    }
    catch(e) {
        // console.log('error :', e)
        alert('Failed to apply, please try again later.');
    }
    document.getElementById('v3-submit-btn').removeAttribute('disabled');
    // fetch(endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // Add other headers if needed
    //   },
    //   body: {...payload},
    // })
    // .then(response => {
    //     console.log('res :', response)
    //         alert('Applied successfully!');
    // })
    // .catch(error => {
    //     console.log('error :', error)
    //     alert('Failed to apply, please try again later.');
    // });
  }


document.addEventListener('DOMContentLoaded', () => {


    // fetch wanted data here
     fetch(`${ENDPOINT}/getwanted?wanted=${wantedName}`)
    .then(response => response.json())
    .then(data => {
      if(data.length === 0) return;

        document.getElementById('bounty').innerHTML = `${data.totalBid} USD`;
        document.getElementById('participants').innerHTML = data.totalParticipants;
        // Update the HTML with dynamic content
    })
    .catch(error => console.error('Error fetching data:', error));


  let currentParticipantsPage = 1;
  let currentPParticipantsPage = 1;

  // Initial data load
  fetchParticipants(currentParticipantsPage);
  fetchPParticipants(currentPParticipantsPage);



  // Event listener for "Load More" button click
  document.getElementById('load-more-participants').addEventListener('click', () => {
    currentParticipantsPage++;
    fetchParticipants(currentParticipantsPage);
  });

  // Event listener for "Load More" button click
  document.getElementById('load-more-pparticipants').addEventListener('click', () => {
    currentPParticipantsPage++;
    fetchPParticipants(currentPParticipantsPage);
  });

  // Function to fetch data from Node.js server
  function fetchParticipants(currentParticipantsPage) {
    fetch(`${ENDPOINT}/getparticipants?wanted=${wantedName}&page=${currentParticipantsPage}`)
      .then(response => response.json())
      .then(data => {
        // Populate the table with fetched data
        populateTable(data.participants, 'participants-table');
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Function to fetch data from Node.js server
  function fetchPParticipants(currentPParticipantsPage) {
    fetch(`${ENDPOINT}/getunderreview?wanted=${wantedName}&page=${currentPParticipantsPage}`)
      .then(response => response.json())
      .then(data => {
        // Populate the table with fetched data
        populateTable(data, 'pparticipants-table', true);
      })
      .catch(error => console.error('Error fetching data:', error));
  }


  // Function to populate the table
  function populateTable(data, table, isPP = false) {
    const tableBody = document.getElementById(table);

    // If it's the first page, clear existing table rows
    if (currentParticipantsPage === 1) {
      tableBody.innerHTML = '';
    }

    // Loop through the data and create table rows
    data.forEach(item => {
      const row = document.createElement('tr');
      if(isPP) {
        row.innerHTML = `
        <td>@${item.account}</td>
        <td>${item.amount}</td>
        <td>${item.country}</td>
        <td><img src="${ENDPOINT}/getfundimage?wanted=${wantedName}&account=${item.account}" alt="${item.account} funds" style="width: 100px; height: 100px;"></td>
        <td class="rating-cell">
        <button class="btn btn-light rating-btn" onclick="upvote(this, '${item.account}')"> <i class="fas fa-arrow-up"></i> </button>
        <span>${item.rating}</span>
        <button class="btn btn-light rating-btn" onclick="downvote(this, '${item.account}')"> <i class="fas fa-arrow-down"></i> </button>
      </td>
        `;
      }
      else
      {
          if(!item.isImage) {
            row.innerHTML = `
              <td>@${item.account}</td>
              <td>${item.amount}</td>
              <td>${item.country}</td>
              <td></td>
            `;
          }
          else{
            row.innerHTML = `
            <td>@${item.account}</td>
            <td>${item.amount}</td>
            <td>${item.country}</td>
            <td><img src="${ENDPOINT}/getfundimage?wanted=${wantedName}&account=${item.account}" alt="${item.account} proof of funds" style="width: 100px; height: 100px;"></td>
            `;
          }
      }
      tableBody.appendChild(row);
    });
  }
});
