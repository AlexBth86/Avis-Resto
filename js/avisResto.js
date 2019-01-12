var tableauFiches = [];

$(document).ready(function() {

    // **************************************** PLUGIN STAR RATING **************************************** //

    // AJOUT AVIS (#star-rating-1') / AJOUT RESTAURANT ('#star-rating-2')

    $(function() {
        $('#star-rating-1').barrating({
            theme: 'fontawesome-stars',
            onSelect: function(value, text) {}
        });
        $('#star-rating-2').barrating({
            theme: 'fontawesome-stars',
            onSelect: function(value, text) {}
        });
    });

    // ************************************** EXPAND & FILTRE ************************************************* //

    // MASQUAGE FILTRE LORS DE L'AFFICHAGE DE LA PAGE

    $(".expand-filtre").hide();

    // EXPAND "VOIR LES COMMENTAIRES"

    $(document).on("click", ".bouton-see-more", function() {
        if ($(this).text() == "Masquer les commentaires") {
            $(this).html("Voir les commentaires");
        } else {
            $(this).html("Masquer les commentaires");
        }
    });

    // EXPAND FILTRE

    $(document).on("click", ".filtre-note", function() {
        $(".expand-filtre").toggle(400);

    });

    // EXPAND FILTRE (FERMETURE AU CLIC N'IMPORTE OU DANS LA PAGE)

    $(document).mouseup(function(e) {
        var container = $(".expand-filtre");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });


    // ****************************************** SYSTEME DE FILTRE ****************************************** //
    // getaverageNote() (Methode classeFicheResto)

    function setupFilterCallback(minStars, allRestaurants) {
        var tempArrayResto = [];

        allRestaurants.sort(function(a, b) {
            return b.getaverageNote() - a.getaverageNote();
        });

        allRestaurants.forEach(function(element) {
            if (element.getaverageNote() >= minStars) {
                tempArrayResto.push(element);
            }
        });
        $(".expand-filtre").slideToggle(400);
        refreshResto();
        tempArrayResto.forEach(function(element) {
            element.creationFicheResto();
            $(".nbr-resto").html(tempArrayResto.length + " restaurants");
        })
    }

    // GESTION DU CLIC

    var nbrEtoile = [1, 2, 3, 4, 5];

    $.each(nbrEtoile, function(key, value) {
        $("#star-" + value).on("click", function() {
            setupFilterCallback(value, tableauFiches);
        });
    });


    // *************************** AJOUT DE RESTAURANT VIA BOUTON "AJOUTER RESTAURANT" ************************* //

    $(".bouton-ajout-resto").on('click', function() {
        $("input#nom-new-resto").val("");
        $("#num-adresse-new-resto").val("");
        $("input#adresse-new-resto").val("");
        $("#code-postal-new-resto").val("");
        $("input#ville-new-resto").val("");
        $("textarea#user-comment-new-resto").val("");
    });

    // VERIFICATION CHAMPS FORMULAIRE

    var forms = document.getElementsByClassName('needs-validation');
    var modalAjoutresto = $("#addRestoModal");

    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (form.checkValidity() === true) {
                $(modalAjoutresto).modal("hide");

                // RECUPERATION INFORMATION MODAL

                var nomNewResto = $("input#nom-new-resto").val();
                var adresseNewResto = parseInt($("#num-adresse-new-resto").val()) + " " + $("input#adresse-new-resto").val();
                var city = parseInt($("#code-postal-new-resto").val()) + " " + $("input#ville-new-resto").val();

                var userStarRateNewResto = parseInt($("#star-rating-2").val());

                var myLatLng = markersPopIn[0].position;
                var latNewMarker = myLatLng.lat();
                var lngNewMarker = myLatLng.lng();

                var userCommentNewResto = $("textarea#user-comment-new-resto").val();

                // CREATION NOUVELLE FICHE RESTAURANT + IMPLEMENTATION SUR PAGE

                var idNewResto = tableauFiches.length + 1;

                const resto = new FicheResto(
                    idNewResto,
                    nomNewResto,
                    adresseNewResto,
                    city, [{ "stars": userStarRateNewResto, "comment": userCommentNewResto }],
                    latNewMarker,
                    lngNewMarker)

                tableauFiches.push(resto);
                resto.creationFicheResto();

                // MISE A JOUR NOMBRE FICHE RESTAURANT SUR BANDEAUX

                $(".nbr-resto").html(tableauFiches.length + " restaurants");
            }
            form.classList.add('was-validated');
        }, false);
    });
});


// **************************************** FIN DU $(document).ready() ******************************** //



// ******************** FONCTION AVERAGE REVIEW & REFRESH RESTO (LISTE + MARKERS MAPS) ***************** //

function averageReview(totalNote, longueurTableau) {
    return totalNote / longueurTableau;
}

function refreshResto() {
    $('div.fiche-resto').remove();
    clearMarkersBigMapforFilter(null);
}
