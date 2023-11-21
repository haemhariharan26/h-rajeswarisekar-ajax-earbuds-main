(() => {

  //variables
  const model = document.querySelector("#model");
  const hotspots = document.querySelectorAll(".Hotspot");

  const materialTemplate = document.querySelector("#material-template");
  const materialList = document.querySelector("#material-list");

  const spinner = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="6" height="14" x="1" y="4" fill="currentColor"><animate id="svgSpinnersBarsFade0" fill="freeze" attributeName="opacity" begin="0;svgSpinnersBarsFade1.end-0.25s" dur="0.75s" values="1;.2"/></rect><rect width="6" height="14" x="9" y="4" fill="currentColor" opacity=".4"><animate fill="freeze" attributeName="opacity" begin="svgSpinnersBarsFade0.begin+0.15s" dur="0.75s" values="1;.2"/></rect><rect width="6" height="14" x="17" y="4" fill="currentColor" opacity=".3"><animate id="svgSpinnersBarsFade1" fill="freeze" attributeName="opacity" begin="svgSpinnersBarsFade0.begin+0.3s" dur="0.75s" values="1;.2"/></rect></svg>`;
  // Loader function
  function showLoader() {
    model.innerHTML = '<object type="image/svg+xml" data="../images/loader.svg" class="loader"></object>';
  }

  // User error message function
  function showError(message) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.classList.add('error');
    document.body.appendChild(errorMessage);
  }
  //functions
  function modelLoaded() {
    hotspots.forEach(hotspot => {
      hotspot.style.display = "block";
    });
  }

  function loadInfoBoxes() {
    // model.innerHTML = spinner;
    showLoader();
    fetch("https://swiftpixel.com/earbud/api/infoboxes")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(infoBoxes => {
        model.innerHTML = ''; // Remove loader
        console.log(infoBoxes);
        
        infoBoxes.forEach((infoBox, index) => {
          let selected = document.querySelector(`#hotspot-${index + 1}`);
  
          const titleElement = document.createElement('h2');
          titleElement.textContent = infoBox.heading;
  
          const textElement = document.createElement('p');
          textElement.textContent = infoBox.description;

          const img = document.createElement('img');
          img.src = `images/${infoBox.thumbnail}`;
  
          selected.appendChild(img);
          selected.appendChild(titleElement);
          selected.appendChild(textElement);
        });
      })
      .catch(error => {
        console.error(error);
        model.innerHTML = ''; // Remove loader on error
        showError("Oops! Something went wrong. Please try again later.");
      });
  }
  loadInfoBoxes();

  function loadMaterialsInfo() {
    showLoader();
    fetch("https://swiftpixel.com/earbud/api/materials")
      .then(response => response.json())
      .then(materialListData => {
        materialListData.forEach(material => {
          model.innerHTML = ''; // Remove loader
          const clone = materialTemplate.content.cloneNode(true);
          const materialHeading = clone.querySelector(".material-description");
          materialHeading.textContent = material.heading;

          const materialDescription = clone.querySelector('.material-description');
          materialDescription.textContent = material.description;

          materialList.appendChild(clone);
        });
      })
      .catch(error => {
        console.error(error);
        model.innerHTML = ''; // Remove loader on error
        showError("Oops! Something went wrong fetching materials. Please try again later.");
      });
  } 
  loadMaterialsInfo();

  function showInfo() {
    let selected = document.querySelector(`#${this.slot}`);
    gsap.to(selected, 1, { autoAlpha: 1 });
  }

  function hideInfo() {
    let selected = document.querySelector(`#${this.slot}`);
    gsap.to(selected, 1, { autoAlpha: 0 });
  }

  //Event listeners
  model.addEventListener("load", modelLoaded);

  hotspots.forEach(function (hotspot) {
    hotspot.addEventListener("mouseenter", showInfo);
    hotspot.addEventListener("mouseleave", hideInfo);
  });

})();

