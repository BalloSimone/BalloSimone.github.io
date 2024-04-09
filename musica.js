let contatore = 1; //canzone corrente
let isPlaying;
let song, song_el, last_vol = 40;
let mute = false;

let canzoni_autori = {
    titoli_canzoni : ["Pastello Bianco", "Casa mia", "Capolavoro", "UN RAGAZZO UNA RAGAZZA", "Burn It Down"],
    autori : ["Pinguini Tattici Nucleari", "Ghali", "Il Volo", "The Kolors", "Linkin Park"],
    immagini : ["https://i.scdn.co/image/ab6761610000e5eb18505fd55b5918fe7c6b1fcc", "https://i.scdn.co/image/ab6761610000e5ebe4fe183726b076fa996e90fa", "https://i.scdn.co/image/ab6761610000e5ebd5ce3d93025863d358017c4b", "https://i.scdn.co/image/ab6761610000e5ebb28b9006e9f7a70d26af9b17", "https://i.scdn.co/image/ab67616d0000b273e2f039481babe23658fc719a"],
    audio : ["Pastello_bianco.mp3", "Casa_mia.mp3", "Capolavoro.mp3", "UN_RAGAZZO_UNA_RAGAZZA.mp3", "BURN_IT_DOWN.mp3"], 
    color : ["#e40b52", "#a53029", "#235a81", "#940001", "#bcbdc7"]
}

window.onload = function(){
    document.getElementById('btn1').addEventListener('click', restart_music);
    document.getElementById('btn2').addEventListener('click', pause_play_music);
    document.getElementById('btn3').addEventListener('click', skip_music);
    document.getElementById('btn4').addEventListener('click', mute_unmute_volume);
    document.getElementById('range').addEventListener('click', change_time);
    document.getElementById('range_volume').addEventListener('click', change_volume);

    if (document.readyState === 'complete') {
        console.log('document is already ready, just execute code here');
        init();
    } else {
        console.log('document is not ready');
        document.addEventListener('DOMContentLoaded', init);
    }

    setInterval(update, 1000);
}

function init(){
    isPlaying = false;
    song = document.querySelector('#audio');
    song_el = document.getElementById('audio');
    song_el.volume = 0.5;
    document.querySelector('#volume_bar').setAttribute("style", "width: 50%;"); 
    song.setAttribute('src', "mp3/"+canzoni_autori.audio[contatore]);

    update_background();
    reset_timer();

    document.getElementById("title1").innerHTML = canzoni_autori.titoli_canzoni[0];
    document.getElementById("text1").innerHTML = canzoni_autori.autori[0];
    document.getElementById("title2").innerHTML = canzoni_autori.titoli_canzoni[1];
    document.getElementById("text2").innerHTML = canzoni_autori.autori[1];
    document.getElementById("title3").innerHTML = canzoni_autori.titoli_canzoni[2];
    document.getElementById("text3").innerHTML = canzoni_autori.autori[2];
    document.querySelector("#image_1").setAttribute("src", canzoni_autori.immagini[0]);
    document.querySelector("#image_2").setAttribute("src", canzoni_autori.immagini[1]);
    document.querySelector("#image_3").setAttribute("src", canzoni_autori.immagini[2]);
}




function pause_play_music() {
    let playButton = document.querySelector('.play_button');

    if (!isPlaying) {
        song.play();
        playButton.setAttribute("src", "Icone/pause.svg");
    } else {
        song.pause();
        playButton.setAttribute("src", "Icone/play-fill.svg");
    }

    isPlaying = !isPlaying;
}

function skip_music(){

    if(contatore < canzoni_autori.titoli_canzoni.length - 1){ 
        contatore++;
        song.setAttribute("src", "mp3/"+canzoni_autori.audio[contatore]);
        song.play();
        
        reset_timer();

        isPlaying = true;
        document.querySelector('.play_button').setAttribute("src", "Icone/pause.svg");
    }

    if(contatore == 1)
        document.getElementById('PrecMusic').style.visibility = "visible";

    if(contatore == canzoni_autori.titoli_canzoni.length - 1)
        document.getElementById('PostMusic').style.visibility = "hidden";

    update_text();
    update_background();
}

function restart_music(){
    if(document.getElementById('time_now').innerHTML == "0:00"){
        ret_to_prec_music();
    }else{
        reset_timer();
        song_el.currentTime = 0;
    }
}

function ret_to_prec_music(){
    if(contatore > 0){
        contatore--; 
        song.setAttribute("src", "mp3/"+canzoni_autori.audio[contatore]);
        song.play();
        
        reset_timer();

        isPlaying = true;
        document.querySelector('.play_button').setAttribute("src", "Icone/pause.svg");
    }

    if(contatore == 0)
        document.getElementById('PrecMusic').style.visibility = "hidden";

    if(contatore == canzoni_autori.titoli_canzoni.length - 2)
        document.getElementById('PostMusic').style.visibility = "visible";

    update_text();
    update_background();
}

function update_background(){
    document.body.style.backgroundColor = canzoni_autori.color[contatore];
}

function update_text(){
    for(let i=1; i<=3; i++){
        let title = document.querySelector("#title"+i);
        let text = document.querySelector("#text"+i);
        let image = document.querySelector("#image_"+i);
        title.innerHTML = canzoni_autori.titoli_canzoni[contatore-2+i];
        text.innerHTML = canzoni_autori.autori[contatore-2+i];
        image.setAttribute("src", canzoni_autori.immagini[contatore-2+i]);
    }
}

function reset_timer(){
    document.getElementById("time_now").innerHTML = "0:00";
    document.querySelector('.progress-bar').setAttribute("style", "width=0%;")
    find_song_duration();
}

function change_time(){
    let range_value = document.getElementById('range').value;
    let new_timer = from_timer_to_sec(document.getElementById('total_time').innerHTML) * range_value / 100;
    document.querySelector('.progress-bar').setAttribute("style", "width: "+range_value+"%;");    
    document.getElementById('time_now').innerHTML = from_sec_to_timer(new_timer);
    song_el.currentTime = new_timer;
}

function change_volume(){
    let new_vol = document.getElementById('range_volume').value;
    song_el.volume = new_vol / 100;
    document.querySelector('#volume_bar').setAttribute("style", "width: "+new_vol+"%;"); 
    
    if(new_vol >= 50)
        document.getElementById('img_vol').setAttribute("src", "Icone/volume-up-fill.svg");
    else
        document.getElementById('img_vol').setAttribute("src", "Icone/volume-down-fill.svg");
}

function mute_unmute_volume(){
    if(mute){
        document.querySelector('#volume_bar').setAttribute("style", "width: "+last_vol+"%;");
        song_el.volume = last_vol / 100; 

        if(last_vol >= 50)
            document.getElementById('img_vol').setAttribute("src", "Icone/volume-up-fill.svg");
        else
            document.getElementById('img_vol').setAttribute("src", "Icone/volume-down-fill.svg");

    }else{
        document.querySelector('#volume_bar').setAttribute("style", "width: 0%;");
        document.getElementById('img_vol').setAttribute("src", "Icone/volume-mute-fill.svg");
        last_vol = song_el.volume * 100;
        song_el.volume = 0; 
    }

    mute = !mute;
}

function find_song_duration(){
    let audio = song_el;
    audio.onloadedmetadata = function() {
        let d = parseInt(audio.duration);
        document.getElementById('total_time').innerHTML = from_sec_to_timer(d);
    };
}

function from_sec_to_timer(seconds){
    let min = parseInt(seconds/60);
    let sec = parseInt(seconds%60);
    if(sec<10)
        return min+":0"+sec;
    return min+":"+sec;
}

function from_timer_to_sec(timer){
    let arr = timer.split(':');
    return parseInt(arr[0])*60 + parseInt(arr[1]);
}

function update(){
    if(isPlaying){
        var time = parseInt(song_el.currentTime);
        document.getElementById('time_now').innerHTML = from_sec_to_timer(time);
        var perc = (time / from_timer_to_sec(document.getElementById('total_time').innerHTML)) * 100;
        document.querySelector('.progress-bar').setAttribute("style", "width: "+perc+"%;");
    }
    if(document.querySelector('.progress-bar').getAttribute("style").split(': ')[1] == "100%;")
        skip_music();
}
