// utilisation de URLsearchparams() pour recuperer le paramettre id de l'url
let id_product = new URL(location.href).searchParams.get("id");

const recupData = async () => {
  await fetch(`http://localhost:3000/api/products/${id_product}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((dataArticle) => {
      construireProduct(dataArticle);
    })

    .catch((err) => {
      console.log(err);
    });
};

//function qui permet d'afficher les informations relatives au produit
function construireProduct(product) {
  document.getElementById("item").innerHTML = ` <article>
            <div class="item__img">
              <img src="${product.imageUrl}" alt="Photographie d'un canapé"> 
            </div>
            <div class="item__content">

              <div class="item__content__titlePrice">
                <h1 id="title">${product.name}</h1>
                <p>Prix : <span id="price">${product.price}</span>€</p>
              </div>

              <div class="item__content__description">
                <p class="item__content__description__title">${product.description}</p>
                <p id="description"><!-- Dis enim malesuada risus sapien gravida nulla nisl arcu. --></p>
              </div>

              <div class="item__content__settings">
                <div class="item__content__settings__color">
                  <label for="color-select">Choisir une couleur :</label>
                  <select name="color-select" id="colors">
                      <option value="">--SVP, choisissez une couleur --</option>`;
  for (let i in product.colors) {
    document.querySelector(
      "select"
    ).innerHTML += ` <option value="${product.colors[i]}">${product.colors[i]}</option>`;
  }
  const div = document.createElement("div");
  let divParent = document.querySelector(".item__content__settings");
  divParent.appendChild(div);
  div.classList.add("item__content__settings__quantity");

  const label = document.createElement("label");
  div.appendChild(label);
  label.setAttribute("for", "itemQuantity");
  label.textContent = "Nombre d'article(s) (1-100) :";

  const input = document.createElement("input");
  div.appendChild(input);
  input.setAttribute("type", "number");
  input.setAttribute("name", "itemQuantity");
  input.setAttribute("min", "1");
  input.setAttribute("max", "100");
  input.setAttribute("value", "0");
  input.setAttribute("id", "quantity");

  const divBtn = document.createElement("div");
  let divBtnParent = document.querySelector(".item__content");
  divBtnParent.appendChild(divBtn);
  divBtn.classList.add("item__content__addButton");

  const btn = document.createElement("button");
  divBtn.appendChild(btn);
  btn.setAttribute("id", "addToCart");
  btn.textContent = "Ajouter au panier";

  ajouterPanier(product);
}

// function qui permet d'ajouter les produits au panier
const ajouterPanier = (product) => {
  let boutton = document.getElementById("addToCart");
  boutton.addEventListener("click", () => {
    let listeProduit = JSON.parse(localStorage.getItem("produit"));
    let couleur = document.getElementById("colors");
    let quantite = document.getElementById("quantity");

    const elementsChoisi = {
      couleur: `${couleur.value}`,
      quantite: `${quantite.value}`,
    };
    if (couleur.value == "" || quantite.value == 0) {
      alert("Informations manquantes !");
    } else {
      document.location.href = "cart.html";
      const infoProduit = Object.assign({}, product, elementsChoisi);

      const produitSansprix = {
        id: infoProduit._id,
        nom: infoProduit.name,
        image: infoProduit.imageUrl,
        alt: infoProduit.altTxt,
        quantite: infoProduit.quantite,
        couleur: infoProduit.couleur,
      };

      if (listeProduit == null) {
        listeProduit = [];
        listeProduit.push(produitSansprix);

        localStorage.setItem("produit", JSON.stringify(listeProduit));
      } else {
        for (let i in listeProduit) {
          if (
            listeProduit[i].id == produitSansprix.id &&
            listeProduit[i].couleur == couleur.value
          ) {
            return (
              (listeProduit[i].quantite =
                parseInt(listeProduit[i].quantite) + parseInt(quantite.value)),
              localStorage.setItem("produit", JSON.stringify(listeProduit)),
              (listeProduit = JSON.parse(localStorage.getItem("produit")))
            );
          }
        }

        for (let i in listeProduit) {
          if (
            (listeProduit[i].id == produitSansprix.id &&
              listeProduit[i].couleur != couleur.value) ||
            listeProduit[i].id != produitSansprix.id
          ) {
            return (
              listeProduit.push(produitSansprix),
              localStorage.setItem("produit", JSON.stringify(listeProduit)),
              (listeProduit = JSON.parse(localStorage.getItem("produit")))
            );
          }
        }
      }
    }
  });
};
recupData();
