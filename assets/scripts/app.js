const form = document.querySelector("#requests form");
const input = document.querySelector("#requests input");
const msg = document.querySelector("#requests .msg");
const cities = document.getElementById("results");

const apiKeyWeather = "e056944b3d73480ce0fc8ab5901a2f98"; 
const apiKeyPexels = "AgkMRHVNdy2zuPgqpPCyF2klfe2eA3RsPU4cpBR5Ib1IWmFHyNTXBmn6"; 

form.addEventListener("submit", event => {
    event.preventDefault();

    const city = input.value.trim();

    if (!city) {
        msg.textContent = "Inserisci una città valida!";
        return;
    }

    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric&lang=it`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Città non trovata");
            }
            return response.json();
        })
        .then(data => {
            const name = data.name;
            const country = data.sys.country;
            const temp = Math.round(data.main.temp);
            const icon = data.weather[0].icon;
            const description = data.weather[0].description;

            // Crea la card meteo
            const card = document.createElement("div");
            card.classList.add("card-meteo");

            card.innerHTML = `
                <div class="card-meteo-header">
                    <h2 class="card-meteo-title">
                        <span>${name}</span>
                        <sup>${country}</sup>
                    </h2>
                </div>
                <div class="card-meteo-body">
                    <div class="card-meteo-temp">
                        <span>${temp}</span><sup>°C</sup>
                    </div>
                    <figure class="card-meteo-figure">
                        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                        <figcaption>${description}</figcaption>
                    </figure>
                </div>
            `;

            cities.innerHTML = "";
            cities.appendChild(card);
            msg.textContent = "";

            
            const pexelsUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;

            fetch(pexelsUrl, {
                headers: {
                    Authorization: apiKeyPexels
                }
            })
            .then(response => response.json())
            .then(pexelsData => {
                if (pexelsData.photos.length > 0) {
                    const photoUrl = pexelsData.photos[0].src.large;
                    
                    document.body.style.backgroundImage = `url(${photoUrl})`;
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                } else {
                    msg.textContent = "Nessuna immagine trovata su Pexels per questa città.";
                }
            })
            .catch(error => {
                console.error("Errore Pexels:", error);
                msg.textContent = "Errore nel recupero dell'immagine.";
            });
            
        });

    form.reset();
    input.focus();
});

