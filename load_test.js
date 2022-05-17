import http from 'k6/http';

export default function () {
    const url = 'http://localhost:3000';
    const payload = JSON.stringify({
        username: 'ravi.van.test@gmail.com',
        password: 'ravi.van.test@gmail.com',
    });

    let options = {
        duration: '5m',
        timeout: '300s',
        vus: 50,
        headers: {
            'Content-Type': 'application/json',
        },
    };


    http.post(url, payload, options);
}