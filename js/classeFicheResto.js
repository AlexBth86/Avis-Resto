class FicheResto {

    constructor (idResto, name, adresse, ville, avis, lat, long) {
        this.idResto = idResto;
        this.name = name;
        this.adresse = adresse;
        this.ville = ville;
        this.avis = avis;
        this.lat = lat;
        this.long = long;
        this.bodyCardCollapse = null;
        this.averageNote = null;
    }

    creationFicheResto() {

        let emplacementFicheResto = document.getElementById('scroll-list-resto');

        // CREATION DIV FICHE RESTO
        let ficheResto = document.createElement('div');
        ficheResto.setAttribute('class', 'fiche-resto');
        ficheResto.setAttribute('id', 'fiche-resto'+this.idResto);

        // CREATION CHAMP INFOS RESTO (titre + adresse)
        let containerInfoResto = document.createElement('div');
        containerInfoResto.className = 'd-flex justify-content-between';
        let infoResto = document.createElement('div')
        infoResto.className = 'info-resto';
        let nameResto = document.createElement('h3');
        let adresseResto = document.createElement('p');
        adresseResto.className = 'adresse';
        let villeResto = document.createElement('p');
        villeResto.className = 'ville';

        // CREATION BOUTON AJOUT AVIS
        let boutonAjoutAvis = document.createElement('button');
        boutonAjoutAvis.setAttribute("type", "button");
        boutonAjoutAvis.setAttribute("class", "btn float-right d.inline-block bouton-add-avis");
        boutonAjoutAvis.setAttribute("data-toggle", "modal");
        boutonAjoutAvis.setAttribute("data-target", "#addAvisModal");
        boutonAjoutAvis.innerHTML = '<img src="img/plus-commentaire.svg" class="plus-avis" alt="plus-avis">Ajouter un avis';

        // AJOUT INFOS DANS LA MODAL "AJOUTER UN AVIS"
        $(boutonAjoutAvis).on('click', function () {
          $("div.info-resto-modal").data('resto', this.idResto);
          $("div.info-resto-modal > h3").html(this.name);
          $("div.info-resto-modal > p").html(this.adresse);
          $("div.photo-resto-modal > img").attr("src", "https://maps.googleapis.com/maps/api/streetview?size=520x320&location="+this.lat+","+this.long+"&fov=90&heading=235&pitch=10&key=AIzaSyCOoJQ82zrvn75_pj4cRAjD0UxPJSQH2EU");
          $("textarea#user-comment").val("");

          // VERIFICATION CHAMPS FORMULAIRE
          var forms = document.getElementsByClassName('needs-validation-2');
          var modalAjoutComments = $("#addAvisModal");

          var checkForm = function(event) {
            var form = event.target || event.srcElement;
            event.stopPropagation();
            event.preventDefault();
            if (form.checkValidity() === true) {
              $(modalAjoutComments).modal("hide");

              // RECUPERATION INFOS UTILISATEUR MODAL
              var userStarRate = $("#star-rating-1").val();
              var userComment = $("textarea#user-comment").val();
              this.avis.push({"stars":userStarRate,"comment":userComment});
              this.addAvis(userStarRate, userComment);
              nombreTotalVote.textContent = this.avis.length + ' votes';
              this.addWidjetAverageStarRate(widjetAverageStarRate);
            }
            form.classList.add('was-validated');
          }.bind(this)

          var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', checkForm, false);
          }.bind(this));

          // REMOVE MODAL EVENTS WHILE THE MODAL CLOSURE
          $(modalAjoutComments).on("hidden.bs.modal", function () {
            Array.prototype.filter.call(forms, function(form) {
              if ($("div.info-resto-modal").data('resto') === this.idResto) {
                form.removeEventListener('submit', checkForm);
              }
            }.bind(this));
          }.bind(this));
        }.bind(this))


        // WIDJET STAR RATE (AVERAGE)
        let containerAverageStarRate = document.createElement('div');
        containerAverageStarRate.className = 'd-flex flex-row';

        let starRateDiv = document.createElement('div');
        starRateDiv.className = 'star-rate br-theme-fontawesome-stars';

        let widjetAverageStarRate = document.createElement('div');
        widjetAverageStarRate.className = 'br-widget';

        this.addWidjetAverageStarRate(widjetAverageStarRate);

        // CREATION DIV NOMBRE DE VOTE TOTAL
        let nombreVoteDiv = document.createElement('div');
        nombreVoteDiv.className = 'nbr-vote';

        let nombreTotalVote = document.createElement('p');
        nombreTotalVote.className = 'vote';

        // CREATION COLLAPSE (PHOTOS + AVIS + NOTES UTILISATEUR)
        let collapse = document.createElement('div');
        collapse.setAttribute('id', 'collapse' + this.idResto);
        collapse.className = 'collapse avis-expand';

        this.bodyCardCollapse = document.createElement('div');
        this.bodyCardCollapse.className = "card card-body avis-expand-card";

        let photoResto = document.createElement('div');
        photoResto.setAttribute("id", "divStreetView" + this.idResto);
        photoResto.className = 'photo-resto';

        let imageResto = document.createElement('img');
        imageResto.setAttribute('src', "https://maps.googleapis.com/maps/api/streetview?size=520x320&location="+this.lat+","+this.long+"&fov=90&heading=235&pitch=10&key=AIzaSyCOoJQ82zrvn75_pj4cRAjD0UxPJSQH2EU");

        // BOUTON VOIR PLUS (OUVERTURE COLLAPSE)
        let boutonVoirPlus = document.createElement('button');
        boutonVoirPlus.setAttribute("type", "button");
        boutonVoirPlus.setAttribute("class", "btn position-relative fixed-bottom bouton-see-more");
        boutonVoirPlus.setAttribute("data-toggle", "collapse");
        boutonVoirPlus.setAttribute("data-target", "#collapse" + this.idResto);
        boutonVoirPlus.setAttribute("aria-expanded", "false");
        boutonVoirPlus.setAttribute("aria-controls", "collapseExample");
        boutonVoirPlus.innerHTML = 'Voir les commentaires';

        // IMPLEMENTATION FRONT DES ELEMENTS PRECEDENTS POUR CREATION FICHE
        emplacementFicheResto.appendChild(ficheResto);
        ficheResto.appendChild(containerInfoResto);
        containerInfoResto.appendChild(infoResto);
        containerInfoResto.appendChild(boutonAjoutAvis);
        infoResto.appendChild(nameResto);
        infoResto.appendChild(adresseResto);
        infoResto.appendChild(villeResto);
        ficheResto.appendChild(containerAverageStarRate);
        containerAverageStarRate.appendChild(starRateDiv);
        starRateDiv.appendChild(widjetAverageStarRate);
        containerAverageStarRate.appendChild(nombreVoteDiv);
        nombreVoteDiv.appendChild(nombreTotalVote);
        ficheResto.appendChild(collapse);
        collapse.appendChild(this.bodyCardCollapse);
        this.bodyCardCollapse.appendChild(photoResto);
        photoResto.appendChild(imageResto);
        ficheResto.appendChild(boutonVoirPlus);

        // IMPLEMENTATION INFORMATIONS, AVIS (METHODE addAvis) ET MARKER MAP (METHODE addWidjetAverageStarRate)
        nameResto.textContent = this.name;
        adresseResto.textContent = this.adresse;
        villeResto.textContent = this.ville;
        nombreTotalVote.textContent = this.avis.length + ' votes';
        for (var i = 0; i < this.avis.length; i++) {
            this.addAvis(this.avis[i].stars, this.avis[i].comment);
        }
        this.createMarker(this.idResto, this.lat, this.long, this.name);
    }

    addWidjetAverageStarRate (pageEmplacement) {
        var allNoteResto = [];
        for (var i = 0; i < this.avis.length; i++) {
            allNoteResto.push(parseInt(this.avis[i].stars));
        };
        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        let averageNote = averageReview(allNoteResto.reduce(reducer, 0), this.avis.length);
        this.averageNote = averageNote;

        pageEmplacement.innerHTML = [];
        for (var i = 1; i <= 5; i++) {
            if (i <= Math.round(averageNote)) {
                pageEmplacement.innerHTML += '<a class="br-active"></a>';
            } else {
                pageEmplacement.innerHTML += '<a class=""></a>';
            }
        }
    }

    addWidjetStarRate(note, emplacement) {
        for (var i = 1; i <= 5; i++) {
            if (i <= Math.round(note)) {
                emplacement.innerHTML += '<a class="br-active"></a>';
            } else {
                emplacement.innerHTML += '<a class=""></a>';
            }
        }
    }

    addAvis (note, commentaire) {
            let separateLine = document.createElement('hr');
            let starRateDivCollapse = document.createElement('div');
            starRateDivCollapse.className = 'star-rate-avis br-theme-fontawesome-stars';
            let divParagrapheAvis = document.createElement('div');
            divParagrapheAvis.className = 'paragraphe-avis';
            let paragrapheAvis = document.createElement('p');

            let widjetStarRate = document.createElement('div');
            widjetStarRate.className = 'br-widget';

            this.addWidjetStarRate(note, widjetStarRate);

            this.bodyCardCollapse.appendChild(separateLine);
            this.bodyCardCollapse.appendChild(starRateDivCollapse);
            starRateDivCollapse.appendChild(widjetStarRate);
            this.bodyCardCollapse.appendChild(divParagrapheAvis);
            divParagrapheAvis.appendChild(paragrapheAvis);

            paragrapheAvis.textContent = commentaire;
    }

    createMarker(idResto, lat, long, name) {
        addMarkerForBigMap(idResto, lat, long, name);
    };

    getaverageNote () {
        return Math.round(this.averageNote);
    }

}
