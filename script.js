const skapi = new Skapi('ap22omKCa3z3PlXTeFEc', 'f8e16604-69e4-451c-9d90-4410f801c006', { autoLogin: true });

function signup(event) {
    skapi.signup(event)
        .then(() => window.location.href = 'login.html')
        .catch(err => alert(err.message));
}

function login(event) {
    skapi.login(event)
        .then(() => window.location.href = 'index.html')
        .catch(err => alert(err.message));
}

function logout(event) {
    if (event) event.preventDefault();
    skapi.logout()
        .then(() => window.location.href = 'index.html')
        .catch(err => alert(err.message));
}

function uploadPhoto(event) {
    const progressDiv = document.getElementById('progress');
    progressDiv.style.display = 'block';
    skapi.postRecord(event, { table: 'photos', progress: p => {
        progressDiv.textContent = 'Uploading... ' + Math.round(p.progress * 100) + '%';
    }})
        .then(() => {
            progressDiv.textContent = 'Upload complete!';
            setTimeout(() => window.location.href = 'gallery.html', 500);
        })
        .catch(err => {
            progressDiv.style.display = 'none';
            alert(err.message);
        });
}

function loadGallery() {
    const container = document.getElementById('photos');
    if (!container) return;
    skapi.getRecords({ table: 'photos' }).then(res => {
        res.list.forEach(record => {
            if (record.bin && record.bin.picture && record.bin.picture[0]) {
                record.bin.picture[0].getFile('endpoint').then(url => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'photo';

                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = (record.data && record.data.description) ? record.data.description : '';
                    wrapper.appendChild(img);

                    if (record.data && record.data.description) {
                        const desc = document.createElement('p');
                        desc.className = 'description';
                        desc.textContent = record.data.description;
                        wrapper.appendChild(desc);
                    }

                    container.appendChild(wrapper);
                });
            }
        });
    }).catch(err => {
        container.textContent = err.message;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('login-link');
    const logoutForm = document.getElementById('logout-form');
    const uploadLink = document.getElementById('upload-link');
    skapi.onLogin = profile => {
        if (loginLink) loginLink.style.display = profile ? 'none' : 'inline';
        if (logoutForm) logoutForm.style.display = profile ? 'inline' : 'none';
        if (uploadLink) uploadLink.style.display = profile ? 'inline' : 'none';
    };
    loadGallery();
});
