var busquedaArtistas = [];
var busquedaAlbums = [];
var cancionesEscuchadas = [];
var albumsArtista = [];
var noticiasArtista = [];
var videosArtista = [];
var cancion_actual = 0;
var audios = [];
var Artistas = [];
var artistaId = 0;
var artistaMusikki = 0;

var albumsGlobal = [];
var noticiasGlobal = [];


function redesSociales(referencias, nombre) {
    $("#redesSociales").empty();
    $("#web").empty();
    var redes = [];
    var ui = ["a", "b", "c", "d"];
    var cont = 0;

    for (var i = 0; i < referencias.length; i++) {
        var servicio = referencias[i].service;
        if (redes.indexOf(servicio) === -1) {
            if (servicio === "twitter" || servicio === "facebook" || servicio === "youtube" || servicio === "instagram") {

                var elementoDiv = document.createElement("div");
                var elementoRed = "";
                if (servicio === "youtube") {
                    elementoRed = nombre;
                } else {
                    elementoRed = referencias[i].url.split("/")[3];
                }
                if (servicio === "twitter") {
                    elementoRed = "@" + elementoRed;
                }

                $(elementoDiv).attr("data-red", elementoRed);
                var enlace = document.createElement("a");

                var logo = document.createElement("img");
                $(logo).addClass("iconosRedes");
                enlace.href = referencias[i].url;
                $(enlace).attr("target", "_blank");
                enlace.id = servicio;
                logo.src = "images/" + servicio + ".png";

                $(enlace).append(logo);
                $(elementoDiv).append(enlace);
                $(elementoDiv).addClass("ui-block-" + ui[cont]);

                $("#redesSociales").append(elementoDiv);
                redes.push(servicio);
                cont++;
            }
            else if (servicio === "official")
            {
                var enlace = document.createElement("a");
                enlace.href = referencias[i].url;
                enlace.innerHTML = referencias[i].url.split("/")[2];
                $("#web").append(enlace);
                redes.push(servicio);
            }
        }
    }

}

function cargaAlbums() {
    var lista_albums = [];
    if (navigator.onLine) {
        for (var i = 0; i < albumsArtista.length; i++) {
            if (i === 0) {
                lista_albums.push(albumsArtista[i]);
            } else {

                var album_name = albumsArtista[i].name;
                var muestra = false;
                for (var j = 0; j < lista_albums.length; j++) {
                    if (album_name.toLowerCase().localeCompare(lista_albums[j].name.toLowerCase()) === 0) {
                        muestra = true;
                    }
                }
                if (muestra === false) {
                    lista_albums.push(albumsArtista[i]);
                }

            }
        }
    } else {
        lista_albums = albumsArtista;
    }
    var listado = document.createElement("ol");


    for (var i = 0; i < lista_albums.length; i++) {
        if (navigator.onLine) {
            var enlace = document.createElement("a");
            enlace.href = "#" + lista_albums[i].name;
            enlace.id = lista_albums[i].id;
            var album = document.createElement("img");
            album.src = lista_albums[i].images[1].url;
            album.className = "imagenListaAlbums";
            $(enlace).attr("data-src", lista_albums[i].images[1].url);
            $(enlace).append(album);
            $("#seccionArtista").append(enlace);
            $(enlace).on("click", function () {
                activaCarga();
                $("#caratula").attr("src", $(this).attr("data-src"));
                recuperarDatos('https://api.spotify.com/v1/albums/' + this.id + '', "spotify", datosAlbum);
            });
        } else {

            var elementoLista = document.createElement("li");
            elementoLista.innerHTML = lista_albums[i];
            $(listado).append(elementoLista);
        }
    }
    if (!navigator.onLine) {

        $("#seccionArtista").append(listado);
    }

    $.mobile.loading('hide');

}

function cargaNoticias() {

    for (var i = 0; i < noticiasArtista.length; i++) {
        var noticia = document.createElement("div");
        $(noticia).addClass("bordeBajo");
        var datosFecha = "";
        if (navigator.onLine) {
            datosFecha = noticiasArtista[i].publish_date;
        } else {
            datosFecha = noticiasArtista[i].fecha;
        }
        var dia = datosFecha.day;
        var mes = datosFecha.month;
        var anyo = datosFecha.year;

        var fecha = document.createElement("p");
        fecha.innerHTML = dia + "/" + mes + "/" + anyo;

        var titulo = document.createElement("p");
        titulo.innerHTML = noticiasArtista[i].title;
        titulo.className = "titulo";
        $(noticia).append(fecha);
        $(noticia).append(titulo);
        $("#seccionArtista").append(noticia);
    }
    $.mobile.loading('hide');
}
function cargaVideos() {

    for (var i = 0; i < videosArtista.length; i++) {
        var frame = document.createElement("iframe");
        frame.src = "https://www.youtube.com/embed/" + videosArtista[i].id;
        $(frame).addClass("videoPrincipal");
        $("#seccionArtista").append(frame);
    }
    $.mobile.loading('hide');
}

function datosArtista(data) {

    $("#albumsArtistas").empty();
    $.mobile.loading('hide');
    var biografia = "No se disponen datos biográficos";
    if (arguments.length > 0) {
        $("#nombreArtista").text(data.result.name);
        $("#imagenArtista").attr("src", data.result.image);
        if (data.result.bio) {
            $("#bio").text(data.result.bio.summary);
            biografia = data.result.bio.summary;
        }
        $("#noticias").attr("data-idArtist", data.result.mkid);

        redesSociales(data.result.references, data.result.name);
        enquire.register("screen and (min-width: 50em)", {
            match: function () {

                $("#redesSociales div[class|=ui-block]").each(function () {
                    var red = document.createElement("p");
                    $(red).text($(this).attr("data-red"));
                    $(red).addClass("textoRed");
                    $(this).children().append(red);
                    $(this).children().children().addClass("izquierda");
                });
            },
            unmatch: function () {
                $("#redesSociales div[class|=ui-block]").each(function () {
                    $(this).children().children("p").remove();
                    $(this).children().children().removeClass("izquierda");
                });
            }
        });
        $(".biografia").on("click", function () {
            $("#seccionArtista").empty();
            var texto = document.createElement("h3");
            $(texto).addClass("centerText");
            $(texto).text("Biografía");
            $("#seccionArtista").append(texto);

            var bio = document.createElement("p");
            bio.id = "bio";
            $(bio).text(biografia);
            $("#seccionArtista").append(bio);

        });
        $(".noticias").on("click", function () {
            activaCarga();
            $("#seccionArtista").empty();
            var texto = document.createElement("h3");
            $(texto).addClass("centerText");
            $(texto).text("Noticias");
            $("#seccionArtista").append(texto);
            cargaNoticias();
        });
        $(".videos").on("click", function () {
            activaCarga();
            $("#seccionArtista").empty();
            var texto = document.createElement("h3");
            $(texto).addClass("centerText");
            $(texto).text("Videos");
            $("#seccionArtista").append(texto);
            cargaVideos();
        });
    }

    $(".albums").on("click", function () {
        activaCarga();
        $("#seccionArtista").empty();
        var texto = document.createElement("h3");
        $(texto).addClass("centerText");
        $(texto).text("Albums");
        $("#seccionArtista").append(texto);
        cargaAlbums();
    });

    var indice = _.findIndex(Artistas, {'mkid': data.result.mkid});
    var artista = new Artista(data.result.mkid, artistaId, data.result.name, data.result.image, biografia);
    if (indice === -1) {
        if (Artistas.length === 10) {
            Artistas.splice(0, 1);
        }
    } else {
        Artistas.splice(indice, 1);
    }
    Artistas.push(artista);
    localStorage.setItem("Artistas", JSON.stringify(Artistas));

    $("#Audios").empty();
    audios = [];
    location.href = "#Artista";
}

function datosAlbum(data) {
    $("#albumCanciones").empty();
    $.mobile.loading('hide');
    var indice = _.findIndex(busquedaAlbums, {'id': data.id});
    if (indice === -1) {
        if (busquedaAlbums.length === 10) {
            busquedaAlbums.splice(0, 1);
        }
    } else {
        busquedaAlbums.splice(indice, 1);
    }
    $("#imagenAlbum").attr("src", data.images[1].url);
    $("#nombreAlbum").text(data.name);
    $("#nombreArtistaAlbum").text(data.artists[0].name);
    var popularity = "";
    if (data.popularity) {
        popularity = data.popularity;
        $("#popularidad").html("<strong>Popularidad:</strong> " + data.popularity + "/100");
    }
    var fecha_pub = "";
    if (data.release_date) {
        var fecha = data.release_date.split("-");
        fecha_pub = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
        $("#fecha_pub").html("<strong>Fecha de publicación:</strong> " + fecha[2] + "/" + fecha[1] + "/" + fecha[0]);
    }


    $(".artista").on("click", function () {
        activaCarga();
        $("#nombreArtista").text(data.artists[0].name);
        $("#imagenArtista").attr("src", "images/default-artist.png");
        recuperarDatos('https://api.spotify.com/v1/artists/' + data.artists[0].id + '/albums', "spotify", getalbums);
        recuperarDatos('https://music-api.musikki.com/v1/artists/?q=[artist-alias:' + data.artists[0].name + ']&limit=10', "musikki", obtieneArtista);
    });
    var canciones = data.tracks.items;
    $("#Audios").empty();
    audios = [];
    for (var i = 0; i < canciones.length; i++) {
        var elementoLista = document.createElement("a");
        $(elementoLista).addClass("ui-btn");
        var divContenedor = document.createElement("div");
        $(divContenedor).addClass("contenedor");
        elementoLista.id = canciones[i].id;
        $(elementoLista).attr("data-title", canciones[i].name);
        $(elementoLista).attr("data-cover", data.images[1].url);
        $(elementoLista).attr("data-artist", data.artists[0].name);
        $(elementoLista).attr("data-artistId", data.artists[0].id);
        $(elementoLista).attr("data-album", data.name);
        $(elementoLista).attr("data-albumId", data.id);
        $(elementoLista).attr("data-audio", canciones[i].preview_url);

        var tituloCancion = document.createElement("p");
        $(tituloCancion).addClass("izquierda eliminaMargenes");
        $(tituloCancion).text(canciones[i].track_number + ". " + canciones[i].name);

        var imagenSonido = document.createElement("img");
        imagenSonido.src = "images/sound.png";
        $(imagenSonido).addClass("iconoSonido");

        $(divContenedor).append(tituloCancion);
        if (audios.indexOf(canciones[i].id) === -1) {
            var audio = document.createElement("audio");
            audio.id = "audio" + canciones[i].id;
            audio.src = canciones[i].preview_url;
            audios.push(canciones[i].id);
            $("#Audios").append(audio);
        }

        $(divContenedor).append(imagenSonido);
        $(elementoLista).append(divContenedor);


        $("#albumCanciones").append(elementoLista);



        $(elementoLista).on("click", function () {
            $(".ui-btn").css("background-color", "#f6f6f6");
            $(this).css("background-color", "#5abd66");
            if (cancion_actual === this.id) {
                document.getElementById("audio" + cancion_actual).pause();
                cancion_actual = 0;
            } else {

                if (cancion_actual !== 0) {
                    if (audios.indexOf(cancion_actual) !== -1) {
                        document.getElementById("audio" + cancion_actual).pause();
                    }
                }

                document.getElementById("audio" + this.id).play();
                cancion_actual = this.id;

                var indice = _.findIndex(cancionesEscuchadas, {'id': this.id});
                var cancion = new CancionEscuchada(this.id, $(this).attr("data-title"), $(this).attr("data-cover"), $(this).attr("data-album"), $(this).attr("data-albumId"), $(this).attr("data-artist"), $(this).attr("data-artistId"), $(this).attr("data-audio"));
                if (indice === -1) {
                    if (cancionesEscuchadas.length === 10) {
                        cancionesEscuchadas.splice(0, 1);
                    }
                } else {
                    cancionesEscuchadas.splice(indice, 1);
                }
                cancionesEscuchadas.push(cancion);
                localStorage.setItem("cancionesEscuchadas", JSON.stringify(cancionesEscuchadas));
            }
        });

    }

    var album = new BusquedaAlbum(data.id, data.name, data.images[1].url, data.artists[0].name, popularity, fecha_pub, canciones);

    busquedaAlbums.push(album);
    localStorage.setItem("busquedaAlbums", JSON.stringify(busquedaAlbums));

    location.href = "#Album";
}

function getalbums(data) {


    albumsArtista = data.items;

    var indice = _.findIndex(albumsGlobal, {'idArtista': artistaId});

    if (indice === -1) {
        if (albumsGlobal.length === 10) {
            albumsGlobal.splice(0, 1);
        }
    } else {
        albumsGlobal.splice(indice, 1);
    }
    var albums = [];
    for (var i = 0; i < data.items.length; i++) {
        albums.push(data.items[i].name);
    }
    albumsGlobal.push(new AlbumsArtista(artistaId, albums));
    localStorage.setItem("albumsGlobal", JSON.stringify(albumsGlobal));
}
function getNoticias(data) {
    if (navigator.onLine) {
        noticiasArtista = data.results;
        var indice = _.findIndex(noticiasGlobal, {'idArtistaMusikki': artistaMusikki});
        if (indice === -1) {
            if (noticiasGlobal.length === 10) {
                noticiasGlobal.splice(0, 1);
            }
        } else {
            noticiasGlobal.splice(indice, 1);
        }

        var noticias = [];

        for (var i = 0; i < data.results.length; i++) {
            var objetoNoticia = {fecha: data.results[i].publish_date, title: data.results[i].title};
            noticias.push(objetoNoticia);
        }
        noticiasGlobal.push(new NoticiasArtista(artistaMusikki, noticias));
        localStorage.setItem("noticiasGlobal", JSON.stringify(noticiasGlobal));
    }
}
function getVideos(data) {
    if (navigator.onLine) {
        videosArtista = data.results;
    }
}
function obtieneArtista(data) {
    if (data.results.length > 0) {
        artistaMusikki = data.results[0].mkid;
        recuperarDatos('https://music-api.musikki.com/v1/artists/' + data.results[0].mkid + '', "musikki", datosArtista);
        recuperarDatos('https://music-api.musikki.com/v1/artists/' + data.results[0].mkid + '/news?limit=5', "musikki", getNoticias);
        recuperarDatos('https://music-api.musikki.com/v1/artists/' + data.results[0].mkid + '/videos?q=[service-name:youtube]&limit=5', "musikki", getVideos);
    } else {
        datosArtista();
    }
}
function activaCarga() {
    $.mobile.loading('show', {
        text: 'Cargando Datos',
        textVisible: true,
        theme: 'a',
        html: ""
    });
}

function anadeBotonArtista(tipo) {
    $("#contenidoArtistas").on('click', 'li', function () {
        activaCarga();
        $("#nombreArtista").text($(this).attr("data-name"));
        $("#imagenArtista").attr("src", $(this).attr("data-image"));
        artistaId = this.id;
        if (navigator.onLine) {
            if (tipo === "busqueda") {
                var indice = _.findIndex(busquedaArtistas, {'id': this.id});
                var artista = new BusquedaArtista(this.id, $(this).attr("data-name"), $(this).attr("data-image"), $(this).attr("data-followers"), $(this).attr("data-popularity"));
                if (indice === -1) {
                    if (busquedaArtistas.length === 10) {
                        busquedaArtistas.splice(0, 1);
                    }
                } else {
                    busquedaArtistas.splice(indice, 1);
                }
                busquedaArtistas.push(artista);
                localStorage.setItem("busquedaArtistas", JSON.stringify(busquedaArtistas));


            }
            recuperarDatos('https://api.spotify.com/v1/artists/' + this.id + '/albums', "spotify", getalbums);
            recuperarDatos('https://music-api.musikki.com/v1/artists/?q=[artist-alias:' + $(this).attr("data-name") + ']&limit=10', "musikki", obtieneArtista);
        } else {

            var indice = _.findIndex(albumsGlobal, {'idArtista': this.id});
            var indice2 = _.findIndex(Artistas, {'idSpotify': this.id});

            if (indice !== -1 && indice2 !== -1) {
                albumsArtista = albumsGlobal[indice].albums;
                artistaMusikki = Artistas[indice2].mkid;

                var indice3 = _.findIndex(noticiasGlobal, {'idArtistaMusikki': artistaMusikki});
                if (indice3 !== -1) {
                    noticiasArtista = noticiasGlobal[indice3].noticias;
                }
                $("#nombreArtista").text(Artistas[indice2].nombre);
                $("#bio").text(Artistas[indice2].bio);

                $(".biografia").on("click", function () {
                    $("#seccionArtista").empty();
                    var texto = document.createElement("h3");
                    $(texto).addClass("centerText");
                    $(texto).text("Biografía");
                    $("#seccionArtista").append(texto);
                    biografia = Artistas[indice2].bio;
                    var bio = document.createElement("p");
                    bio.id = "bio";
                    $(bio).text(biografia);
                    $("#seccionArtista").append(bio);
                });
                $(".noticias").on("click", function () {
                    activaCarga();
                    $("#seccionArtista").empty();
                    var texto = document.createElement("h3");
                    $(texto).addClass("centerText");
                    $(texto).text("Noticias");
                    $("#seccionArtista").append(texto);
                    cargaNoticias();
                });
                $(".videos").on("click", function () {
                    $("#seccionArtista").empty();
                    var texto = document.createElement("h3");
                    $(texto).addClass("centerText");
                    $(texto).text("Videos");
                    var mensaje = document.createElement("p");
                    mensaje.innerHTML = "Videos no disponibles";
                    $(mensaje).addClass("centerText");
                    $("#seccionArtista").append(texto);
                    $("#seccionArtista").append(mensaje);
                });


                $(".albums").on("click", function () {
                    activaCarga();
                    $("#seccionArtista").empty();
                    var texto = document.createElement("h3");
                    $(texto).addClass("centerText");
                    $(texto).text("Albums");
                    $("#seccionArtista").append(texto);
                    cargaAlbums();
                });

                location.href = "#Artista";

            }
            $.mobile.loading('hide');
        }



    });
}
function anadeBotonAlbum() {
    $("#contenidoAlbums").on('click', 'li', function () {
        activaCarga();
        if (navigator.onLine) {
            $("#caratula").attr("src", $(this).attr("data-cover"));
            recuperarDatos('https://api.spotify.com/v1/albums/' + this.id + '', "spotify", datosAlbum);
        } else {
            var indice = _.findIndex(busquedaAlbums, {'id': this.id});
            if (indice !== -1) {
                $("#nombreAlbum").text(busquedaAlbums[indice].name);
                if (busquedaAlbums[indice].popularity !== "") {
                    $("#popularidad").html("<strong>Popularidad:</strong> " + busquedaAlbums[indice].popularity + "/100");
                }
                if (busquedaAlbums[indice].fecha_pub !== "") {
                    $("#fecha_pub").html("<strong>Fecha de publicación:</strong> " + busquedaAlbums[indice].fecha_pub);
                }
                $("#nombreArtistaAlbum").text(busquedaAlbums[indice].artist);
                var canciones = busquedaAlbums[indice].canciones;
                var lista_canciones = document.createElement("ol");
                for (var i = 0; i < canciones.length; i++) {

                    var elementoLista = document.createElement("li");
                    elementoLista.innerHTML = canciones[i].name;
                    $(lista_canciones).append(elementoLista);
                }
                $("#albumCanciones").append(lista_canciones);
                location.href = "#Album";
            }
        }
    });
}
function anadeBotonCancion(tipo) {

    $("#contenidoCanciones li").on('click', function () {
        if (navigator.onLine) {
            $(".ui-btn").css("background-color", "#f6f6f6");
            $(this).css("background-color", "#5abd66");

            if (cancion_actual === this.id) {
                document.getElementById("audio" + cancion_actual).pause();
                cancion_actual = 0;
            } else {

                if (cancion_actual !== 0) {
                    if (audios.indexOf(cancion_actual) !== -1) {
                        document.getElementById("audio" + cancion_actual).pause();
                    }
                }
                document.getElementById("audio" + this.id).play();
                cancion_actual = this.id;
            }
            if (tipo !== "historial") {
                var indice = _.findIndex(cancionesEscuchadas, {'id': this.id});

                var artista = new CancionEscuchada(this.id, $(this).attr("data-title"), $(this).attr("data-cover"), $(this).attr("data-album"), $(this).attr("data-albumId"), $(this).attr("data-artist"), $(this).attr("data-artistId"), $(this).attr("data-audio"));
                if (indice === -1) {
                    if (cancionesEscuchadas.length === 10) {
                        cancionesEscuchadas.splice(0, 1);
                    }
                } else {
                    cancionesEscuchadas.splice(indice, 1);
                }
                cancionesEscuchadas.push(artista);
                localStorage.setItem("cancionesEscuchadas", JSON.stringify(cancionesEscuchadas));
            }
            var elementoAudio = document.getElementById("audio" + this.id);
            var albumId = $(this).attr("data-albumId");
            $(elementoAudio).bind("ended", function () {
                recuperarDatos('https://api.spotify.com/v1/albums/' + albumId + '', "spotify", datosAlbum);
            });
        } else {
            $(".ui-btn").css("background-color", "#f6f6f6");
            $(this).css("background-color", "#ff6e6e");
            if (cancion_actual === this.id) {
                document.getElementById("audio" + cancion_actual).pause();
                cancion_actual = 0;
            }
        }
    });
}

function imprimeDatos(datos, tipoBusqueda, tipoDatos) {
    $.mobile.loading('hide');

    for (var i = 0; i < datos.length; i++) {

        var elementoLista = document.createElement("li");
        elementoLista.id = datos[i].id;
        elementoLista.className = "ui-btn ui-li-static ui-body-inherit ui-li-has-thumb ui-first-child ui-last-child";
        $(elementoLista).attr("title", datos[i].name);

        var imagen = document.createElement("img");
        $(imagen).addClass("imagenLista");

        var nombre = document.createElement("p");
        nombre.className = "name";

        var info = document.createElement("p");
        info.className = "info";

        var acceso = "#contenidoArtistas";

        if (tipoDatos === "artista") {

            $(elementoLista).attr("data-name", datos[i].name);
            var urlImage = "images/default-artist.png";
            var followers = "";
            if (tipoBusqueda !== "historial") {
                followers = datos[i].followers.total;
                if (datos[i].images.length > 0) {
                    urlImage = datos[i].images[1].url;
                }
            } else {
                followers = datos[i].followers;
                if (navigator.onLine) {
                    urlImage = datos[i].image;
                }
            }
            $(elementoLista).attr("data-image", urlImage);
            imagen.src = urlImage;
            nombre.innerHTML = datos[i].name;
            $(elementoLista).attr("data-popularity", datos[i].popularity);
            $(elementoLista).attr("data-followers", followers);
            info.innerHTML = "Popularidad: <strong>" + datos[i].popularity + "/100</strong>";

        } else {
            var image = "images/default-artist.png";
            if (tipoDatos === "album") {
                acceso = "#contenidoAlbums";
                if (tipoBusqueda !== "historial") {
                    image = datos[i].images[1].url;
                } else {
                    if (navigator.onLine) {
                        image = datos[i].cover;
                    }
                    info.innerHTML = datos[i].artist;
                }
            } else {
                acceso = "#contenidoCanciones";
                var artista = "";
                var albumTitle = "";
                var albumId = 0;
                var artistId = 0;
                var audio = "";
                if (tipoBusqueda !== "historial") {
                    image = datos[i].album.images[1].url;
                    artista = datos[i].artists[0].name;
                    albumTitle = datos[i].album.name;
                    albumId = datos[i].album.id;
                    artistId = datos[i].artists[0].id;
                    audio = datos[i].preview_url;
                } else {
                    if (navigator.onLine) {
                        image = datos[i].cover;
                    }
                    artista = datos[i].artist;
                    albumTitle = datos[i].album;
                    albumId = datos[i].albumId;
                    artistId = datos[i].artistId;
                    audio = datos[i].audio;
                }
                info.innerHTML = albumTitle + " - " + artista;
                $(elementoLista).attr("data-album", albumTitle);
                $(elementoLista).attr("data-albumId", albumId);
                $(elementoLista).attr("data-artist", artista);
                $(elementoLista).attr("data-artistId", artistId);

                if (audios.indexOf(datos[i].id) === -1) {
                    var elementoAudio = document.createElement("audio");
                    elementoAudio.id = "audio" + datos[i].id;
                    elementoAudio.src = audio;
                    audios.push(datos[i].id);
                    $("#Audios").append(elementoAudio);
                }
                $(elementoLista).attr("data-audio", audio);
            }
            $(elementoLista).attr("data-title", datos[i].name);
            $(elementoLista).attr("data-cover", image);
            imagen.src = image;
            nombre.innerHTML = datos[i].name;
        }

        $(elementoLista).append(imagen);
        $(elementoLista).append(nombre);
        $(elementoLista).append(info);

        $(acceso).append(elementoLista);
        $(acceso).addClass("ui-listview ui-listview-inset ui-corner-all ui-shadow");
    }
}

function busqueda(datos, contenido, tipo) {

    if (datos.length === 0) {
        var elementoLista = document.createElement("li");
        var noResults = document.createElement("p");
        noResults.innerHTML = "No hay resultados para la búsqueda";
        noResults.className = "centerText";
        $(elementoLista).append(noResults);
        $(contenido).append(elementoLista);
    } else {

        imprimeDatos(datos, contenido, tipo);
    }
}

function buscaArtista(data) {

    busqueda(data.artists.items, "busqueda", "artista");
    anadeBotonArtista("busqueda");
}

function buscaAlbum(data) {

    busqueda(data.albums.items, "busqueda", "album");
    anadeBotonAlbum("busqueda");
}
function buscaCancion(data) {

    busqueda(data.tracks.items, "busqueda", "cancion");
    anadeBotonCancion("busqueda");
}

function muestraArtistas() {
    var busquedas = localStorage.getItem("busquedaArtistas");
    if (busquedas) {
        busquedaArtistas = JSON.parse(busquedas);
    }
    ;

    var busquedaInversa = [];
    for (var i = busquedaArtistas.length - 1; i >= 0; i--) {
        busquedaInversa.push(busquedaArtistas[i]);
    }
    imprimeDatos(busquedaInversa, "historial", "artista");
    anadeBotonArtista("historial");
}
function muestraAlbums() {
    var busquedas = localStorage.getItem("busquedaAlbums");
    if (busquedas) {
        busquedaAlbums = JSON.parse(busquedas);
    }
    ;

    var busquedaInversa = [];
    for (var i = busquedaAlbums.length - 1; i >= 0; i--) {
        busquedaInversa.push(busquedaAlbums[i]);
    }

    imprimeDatos(busquedaInversa, "historial", "album");
    anadeBotonAlbum();
}
function muestraCanciones() {
    var busquedas = localStorage.getItem("cancionesEscuchadas");
    if (busquedas) {
        cancionesEscuchadas = JSON.parse(busquedas);
    }
    ;



    var busquedaInversa = [];
    for (var i = cancionesEscuchadas.length - 1; i >= 0; i--) {
        busquedaInversa.push(cancionesEscuchadas[i]);
    }

    imprimeDatos(busquedaInversa, "historial", "cancion");
    anadeBotonCancion("historial");

}


function recuperarDatos(direccion, api, callback) {
    $.ajax({
        url: direccion,
        type: 'GET',
        dataType: "json",
        success: function (data) {
            callback(data, api);
        },
        error: function (error) {
            console.log(error);
        },
        beforeSend: function (xhr) {
            if (api === "musikki") {
                xhr.setRequestHeader("appid", "e331a00946a020af2a686913cf8b673f");
                xhr.setRequestHeader("appkey", "75bded490972a4730af6227d9acce842");
            }
        }
    });
}

function cargaAlbumsOffline() {
    var busquedas = localStorage.getItem("albumsGlobal");
    if (busquedas) {
        albumsGlobal = JSON.parse(busquedas);
    }
}
function cargaNoticiasOffline() {
    var busquedas = localStorage.getItem("noticiasGlobal");
    if (busquedas) {
        noticiasGlobal = JSON.parse(busquedas);
    }
}
function cargaArtistasOffline() {
    var artistas = localStorage.getItem("Artistas");
    if (artistas) {
        Artistas = JSON.parse(artistas);
    }
}

function cargaDatosOffline() {
    cargaArtistasOffline();
    cargaAlbumsOffline();
    cargaNoticiasOffline();
}



function compruebaConexion() {
    window.addEventListener("online", function () {
        $(".cabecera .sinConexion").remove();
        $('.busqueda').removeAttr('disabled');
        $(".busqueda").attr("placeholder", "¿Qué quieres buscar?");
    });
    window.addEventListener("offline", function () {
        $(".busqueda").attr("disabled", "disabled");
        $(".busqueda").attr("placeholder", "Búsqueda no disponible");

        if (!$(".cabecera div").hasClass(".sinConexion")) {
            var noConexion = document.createElement("div");
            $(noConexion).addClass("sinConexion");
            var mensaje = document.createElement("p");
            $(mensaje).text("No dispones de conexión a internet");
            $(noConexion).append(mensaje);
            $(".cabecera").append(noConexion);
        }

    });
}

function filtraBusquedas() {
    $("#buscaArtista,.busquedaArtistas").on("click", function () {
        $("#contenido .ui-block-b").show();
        $("#contenido .ui-block-c").hide();
        $("#contenido .ui-block-d").hide();
    });
    $("#buscaAlbum,.busquedaAlbums").on("click", function () {
        $("#contenido .ui-block-c").show();
        $("#contenido .ui-block-b").hide();
        $("#contenido .ui-block-d").hide();
    });
    $("#buscaCancion,.busquedaCanciones").on("click", function () {
        $("#contenido .ui-block-d").show();
        $("#contenido .ui-block-b").hide();
        $("#contenido .ui-block-c").hide();
    });
}

function cambiaTamanyo() {
    enquire.register("screen and (max-width: 50em)", {
        match: function () {

            filtraBusquedas();

        },
        unmatch: function () {
            $("#contenido .ui-block-b").show();
            $("#contenido .ui-block-c").show();
            $("#contenido .ui-block-d").show();
        }
    });
    enquire.register("screen and (max-width: 50em)", {
        unmatch: function () {
            filtraBusquedas();

        }
    });

}

(function () {

    compruebaConexion();
    cargaDatosOffline();



    $(".busqueda").on("change", function () {
        $("#contenidoArtistas").empty();
        $("#contenidoAlbums").empty();
        $("#contenidoCanciones").empty();
        activaCarga();
        $("#Audios").empty();
        audios = [];
        if (location.href !== "#main") {
            $(".busqueda").val($(this).val());

            location.href = "#main";
        }
        $("#seccionArtista").empty();
        var titulo = document.createElement("h3");
        $(titulo).addClass("centerText");
        $(titulo).text("Biografía");
        var texto = document.createElement("p");
        texto.id = "bio";
        $("#seccionArtista").append(titulo);
        $("#seccionArtista").append(texto);



        $("#CollapseContent").slideUp();
        recuperarDatos('https://api.spotify.com/v1/search?q=' + $(this).val() + '&type=artist&limit=10', "spotify", buscaArtista);
        recuperarDatos('https://api.spotify.com/v1/search?q=' + $(this).val() + '&type=album&limit=10', "spotify", buscaAlbum);
        recuperarDatos('https://api.spotify.com/v1/search?q=' + $(this).val() + '&type=track&limit=10', "spotify", buscaCancion);
    });

    cambiaTamanyo();
    $(".busquedaArtistas").on("click", function () {
        $("#contenidoArtistas").empty();
        muestraArtistas();
    });
    $(".busquedaAlbums").on("click", function () {
        $("#contenidoAlbums").empty();
        muestraAlbums();
    });
    $(".busquedaCanciones").on("click", function () {
        $("#contenidoCanciones").empty();
        muestraCanciones();
    });




})();


