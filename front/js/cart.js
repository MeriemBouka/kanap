//Récupération des données du Localstorage sous forme d'objet JS
let ajoutProduit = JSON.parse(localStorage.getItem("produit"));

let prixTotale = 0;
let quantiteTotale = 0;
let prixTotalProduit = 0;
const idProduits = [];

// fonction qui permet l'affichage du contenu du panier
const afficherPanier = async () => {
  await ajoutProduit;

  //Récupération des données via l'API
  const recupData = async () => {
    await fetch("http://localhost:3000/api/products")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((dataArticle) => {
        for (let i in ajoutProduit) {
          if (ajoutProduit[i].quantite != 0) {
            for (let j in dataArticle) {
              if (ajoutProduit[i].id == dataArticle[j]._id) {
                let price = dataArticle[j].price;
                document.getElementById(
                  "cart__items"
                ).innerHTML += `<article class="cart__item" data-id="${ajoutProduit[i].id}" data-color="${ajoutProduit[i].couleur}" >
                <div class="cart__item__img">
                  <img src="${ajoutProduit[i].image}" alt="${ajoutProduit[i].alt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${ajoutProduit[i].nom}</h2>
                    <p>${ajoutProduit[i].couleur}</p>
                    <p>${price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" data-id="${ajoutProduit[i].id}" data-color="${ajoutProduit[i].couleur}" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${ajoutProduit[i].quantite}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article> `;
                prixTotalProduit = ajoutProduit[i].quantite * price;
                quantiteTotale =
                  quantiteTotale + parseInt(ajoutProduit[i].quantite);
                prixTotale += prixTotalProduit;
              }
            }
          }
        }
        document.getElementById("totalPrice").innerHTML = prixTotale;
        document.getElementById("totalQuantity").innerHTML = quantiteTotale;
      })
      .catch((err) => {
        console.log(err);
      });
    modifQuantite();
    suppression();
  };
  recupData();
};
afficherPanier();

// Fonction qui modifie la quantité des produits
const modifQuantite = () => {
  let selectNumber = document.querySelectorAll(".itemQuantity");
  selectNumber.forEach((element) => {
    element.addEventListener("change", () => {
      for (let i in selectNumber) {
        for (let j in ajoutProduit) {
          if (
            selectNumber[i].dataset.id == ajoutProduit[j].id &&
            selectNumber[i].dataset.color == ajoutProduit[j].couleur
          ) {
            if (
              selectNumber[i].value != ajoutProduit[j].quantite &&
              ajoutProduit[j].quantite != 0
            ) {
              location.reload();
              return (
                (ajoutProduit[j].quantite = selectNumber[i].value),
                localStorage.setItem("produit", JSON.stringify(ajoutProduit))
              );
            }
          }
        }
      }
    });
  });
};

//Fonction permettant la suppression des articles
const suppression = async (modifQuantite) => {
  await modifQuantite;
  let supp = document.querySelectorAll(".deleteItem");
  for (const element of supp) {
    element.addEventListener("click", () => {
      let article = element.closest("article");
      for (let i in ajoutProduit) {
        if (
          ajoutProduit[i].id == article.dataset.id &&
          ajoutProduit[i].couleur == article.dataset.color &&
          ajoutProduit[i].quantite != 0
        ) {
          location.reload();
          return (
            (ajoutProduit[i].quantite = 0),
            localStorage.setItem("produit", JSON.stringify(ajoutProduit)),
            article.setAttribute("style", "display:none"),
            viderPanier()
          );
        }
      }
    });
  }
};

// Supprimer les valeurs du localStorage
const viderPanier = () => {
  let count = 0;

  for (let i in ajoutProduit) {
    if (ajoutProduit[i].quantite == 0) {
      count++;
    }
  }
  if (count == ajoutProduit.length) {
    return localStorage.removeItem("produit");
  }
};

// poster le formulaire si panier n'est pas null
if (ajoutProduit != null) {
  function send(e) {
    e.preventDefault();

    // Validation du formulaire
    let nom = document.getElementById("lastName").value;
    let prenom = document.getElementById("firstName").value;
    let adresse = document.getElementById("address").value;
    let ville = document.getElementById("city").value;
    let email = document.getElementById("email").value;
    let regEx = /^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/;
    let resultNom = regEx.test(nom);
    let resultPrenom = regEx.test(prenom);
    let resultVille = regEx.test(ville);
    let regExMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let resultMail = regExMail.test(email);
    let regExAdresse = /^(\d{1,3}[a-zA-Z'àâéèêôùûçÀÂÉÈÔÙÛÇ\s-]{1,50})$/;
    let resultAdresse = regExAdresse.test(adresse);

    if (!resultPrenom) {
      document.getElementById("firstNameErrorMsg").innerHTML =
        "<span>Prénom saisi non valid</span>";
      return false;
    } else {
      document.getElementById("firstNameErrorMsg").innerHTML = "";
    }
    if (!resultNom) {
      document.getElementById("lastNameErrorMsg").innerHTML =
        "<span>Nom saisi non valid</span>";
      return false;
    } else {
      document.getElementById("lastNameErrorMsg").innerHTML = "";
    }
    if (!resultAdresse) {
      document.getElementById("addressErrorMsg").innerHTML =
        "<span>Adresse non valide</span>";
      return false;
    } else {
      document.getElementById("addressErrorMsg").innerHTML = "";
    }
    if (!resultVille) {
      document.getElementById("cityErrorMsg").innerHTML =
        "<span>Ville saisie non valide</span>";
      return false;
    } else {
      document.getElementById("cityErrorMsg").innerHTML = "";
    }
    if (!resultMail) {
      document.getElementById("emailErrorMsg").innerHTML =
        "<span>Adresse e-mail non valide</span>";
      return false;
    } else {
      document.getElementById("emailErrorMsg").innerHTML = "";
    }

    //Insertion des id produits dans un tableau;
    for (let i in ajoutProduit) {
      if (ajoutProduit[i].quantite != 0) {
        idProduits.push(ajoutProduit[i].id);
      }
    }

    // Envoyer une requête via la method POST au serveur
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        },
        products: idProduits,
      }),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (data) {
        document.location.href = "confirmation.html?id=" + data.orderId;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

document.forms[0].addEventListener("submit", send);
