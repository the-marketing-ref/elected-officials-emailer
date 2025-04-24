const apiKey = 'AIzaSyA1rMUv-ST44DH2FFghqQUtE1Pqdyn09oA';

const messageText = `I’m writing to express deep concern over Governor Walz’s revised state budget proposal, which includes the complete elimination of non-public pupil aid. This decision would have serious consequences for private schools across Minnesota—including our own school community.

For families like mine, schools such as [insert school name, e.g., United Christian Academy] are more than educational institutions—they are places where children grow in both academic excellence and character, supported by faith-based values and a close-knit community.

The loss of non-public pupil aid, which currently supports essential services, would mean a significant financial blow—over $80,000 in our school’s case. That loss will be felt in real and immediate ways: fewer resources for students, reduced support staff, and increased pressure on families to fill the gap.

This funding helps ensure that all Minnesota students, regardless of the type of school they attend, receive access to a safe, well-rounded education. Removing this support risks creating inequity and sends a troubling message that students in non-public schools are less worthy of investment.

As the final budget is being decided in the coming weeks, I respectfully urge you to stand up for equity in education by preserving non-public pupil aid. Please consider the impact this decision will have on thousands of families, students, and communities across our state.

Thank you for your service and for listening to the voices of the people you represent.

Sincerely,
[Your Full Name]
[Your Address / City, MN]
[Optional: Your School Affiliation]
[Email / Phone Number]`;

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
