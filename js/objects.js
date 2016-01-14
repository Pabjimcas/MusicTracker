function BusquedaArtista(id, nombre, imagen, seguidores, popularidad) {
    this.id = id;
    this.name = nombre;
    this.image = imagen;
    this.followers = seguidores;
    this.popularity = popularidad;
}
function Artista(mkid, idSpotify, nombre, imagen, bio) {
    this.mkid = mkid;
    this.idSpotify = idSpotify;
    this.nombre = nombre;
    this.imagen = imagen;
    this.bio = bio;
}
function NoticiasArtista(mkid, noticias) {
    this.idArtistaMusikki = mkid;
    this.noticias = noticias;
}

function AlbumsArtista(id, albums) {
    this.idArtista = id;
    this.albums = albums;
}
function BusquedaAlbum(id, titulo, caratula, artista, popularidad, fecha_pub, canciones) {
    this.id = id;
    this.name = titulo;
    this.cover = caratula;
    this.artist = artista;
    this.popularity = popularidad;
    this.fecha_pub = fecha_pub;
    this.canciones = canciones;
}
function CancionEscuchada(id, titulo, caratula, album, albumId, artista, artistaId, audio) {
    this.id = id;
    this.name = titulo;
    this.cover = caratula;
    this.album = album;
    this.albumId = albumId;
    this.artist = artista;
    this.artistId = artistaId;
    this.audio = audio;
}
