const apiKey = 'AIzaSyA1rMUv-ST44DH2FFghqQUtE1Pqdyn09oA';

const messageText = `I’m writing to express deep concern over Governor Walz’s revised state budget proposal...';

async function searchOfficials() {
  const address = document.getElementById('addressInput').value;

  try {
    const response = await fetch(`https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${apiKey}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    const officials = data.officials || [];
    const offices = data.offices || [];

    if (!offices.length || !officials.length) {
      document.getElementById('officialsList').innerHTML = "<p>No officials found for this address.</p>";
      return;
    }

    let html = '<form id="emailForm">';
    offices.forEach(office => {
      (office.officialIndices || []).forEach(index => {
        const official = officials[index];
        if (official?.emails?.length) {
          official.emails.forEach(email => {
            const level = office.levels ? office.levels.join(', ') : 'unknown level';
            html += `<label>
              <input type="checkbox" name="email" value="${email}"> 
              <strong>${official.name}</strong> (${level}) - ${email}
            </label><br>`;
          });
        }
      });
    });

    html += '</form>';
    document.getElementById('officialsList').innerHTML = html;
    document.getElementById('previewBox').innerText = messageText;
  } catch (error) {
    console.error("Error fetching official data:", error);
    document.getElementById('officialsList').innerHTML = `<p style="color: red;">Failed to load data. ${error.message}</p>`;
  }
}

function sendEmails() {
  const checkboxes = document.querySelectorAll('input[name="email"]:checked');
  const emails = Array.from(checkboxes).map(cb => cb.value);

  const subject = encodeURIComponent('Please Reconsider Eliminating Non-Public Pupil Aid in the State Budget');
  const body = encodeURIComponent(messageText);

  if (emails.length === 0) {
    alert("Please select at least one official.");
    return;
  }

  const mailtoLink = `mailto:${emails.join(',')}?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
}
