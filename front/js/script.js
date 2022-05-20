// Récupération des donées
const recupData = () => {
  fetch("http://localhost:3000/api/products")
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((dataArticle) => {
      for (let i in dataArticle) {
        document.getElementById(
          "items"
        ).innerHTML += `<a href="./product.html?id=${dataArticle[i]._id}">
            <article>
              <img src="${dataArticle[i].imageUrl}" alt="${dataArticle[i].altTxt}">
              <h3 class="productName">${dataArticle[i].name}</h3>
              <p class="productDescription">${dataArticle[i].description}</p>
            </article>
          </a>`;
      }
    })

    .catch((err) => {
      console.log(err);
    });
};

//Afficher les produits avec la fonction:
recupData();
