const games = document.getElementsByClassName("games")[0]
let translationTable = []
const downloadBtn = document.getElementById("download-click");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const download = url => {
    const options = {
        method: 'GET',
        mode: 'no-cors'
      };
    return fetch(url, options).then(resp => resp.blob());
  };
  
  const downloadByGroup = async (urls, files_per_group=5) => {
    return await P.map(
      urls, 
      async url => {
        return await download(url);
      },
      {concurrency: files_per_group}
    );
  }
  
  const exportZip = (blobs, onFinish) => {
    const zip = JSZip();
    
    blobs.forEach((blob, i) => {
      zip.file(`${translationTable[i]}.exe`, blob);
    });
    zip.generateAsync({type: 'blob'}).then(zipFile => {
      const currentDate = new Date().getTime();
      const fileName = `Games.zip`;
      onFinish();
      return saveAs(zipFile, fileName);
    });
  }
  
  const downloadAndZip = async (urls, onFinish) => {
    return await downloadByGroup(urls, 5).then(async (blobs)=> {
        await exportZip(blobs, onFinish);
    });
  }

function game(iname, iurl)
{
    return {
        name: iname,
        url: iurl
    }
}

function listGame(game)
{
    const div = document.createElement("div");
    div.className = "game";
    const text = document.createElement("p");
    text.innerHTML = game.name;
    text.className = "game-text";
    text.onclick = (e) => { 
        window.location.replace(game.url);
    };
    div.appendChild(text);
    const input = document.createElement("input");
    input.setAttribute('type', 'checkbox');
    input.setAttribute('url', game.url);
    div.appendChild(input);
    games.appendChild(div);
    const hr = document.createElement("hr");
    hr.setAttribute('width', '90%');
    hr.setAttribute('size', '1');
    hr.className = "sep";
    games.appendChild(hr);

}
function addAllGames(list)
{
    list.forEach((i) => listGame(i))
}

const gamesToList = [
    game("Five Nights At Freddys 1 (225MB)", "https://api.jayphen.xyz/content/FiveNightsAtFreddys.exe"),
    game("Five Nights At Freddys 2 (212MB)", "https://api.jayphen.xyz/content/FiveNightsAtFreddys2.exe"),
    game("Five Nights At Freddys 3 (111MB)", "https://api.jayphen.xyz/content/FiveNightsAtFreddys3.exe"),
    game("Five Nights At Freddys: Sister Location (928MB)", "https://api.jayphen.xyz/content/FiveNightsAtFreddysSisterLocation.exe"),
    game("FNAF Ultimate Custom Night (268MB)", "https://api.jayphen.xyz/content/FNAFUltimateCustomNight.exe"),
    game("Portal (785MB)", "https://api.jayphen.xyz/content/Portal.zip"),
    game("Portal 2 (7GB)", "https://api.jayphen.xyz/content/Portal2.zip"),
    game("Half Life 2 (2GB)", "https://api.jayphen.xyz/content/HalfLife2.zip"),
    game("Halo: Combat Evolved (99MB)", "https://api.jayphen.xyz/content/HaloCombatEvolved.exe"),
    game("CS: Source (102MB)", "https://api.jayphen.xyz/content/CounterStrikeSource.exe"),
    game("CS: 1.6 (238MB)", "https://api.jayphen.xyz/content/cs_16.zip"),
    game("Powder Toy (5MB)", "https://api.jayphen.xyz/content/PowderToy.exe")
    

];
addAllGames(gamesToList);


function getAllSelectedGames() {
    let list = []
    Array.from(games.children).forEach((d) => {
        if(d.className != "game") return;
        const checked = d.children[1].checked;
        const name = d.children[0].innerHTML;
        if(checked)
            list.push(game(name, d.children[1].getAttribute("url")))
    });
    return list;
}
function download_files(files) {
    function download_next(i) {
      if (i >= files.length) {
        return;
      }
      var a = document.createElement('a');
      a.href = files[i].download;
      a.target = '_parent';
      // Use a.download if available, it prevents plugins from opening.
      if ('download' in a) {
        a.download = files[i].filename;
      }
      // Add a to the doc for click to work.
      (document.body || document.documentElement).appendChild(a);
      if (a.click) {
        a.click(); // The click method is supported by most browsers.
      } else {
        $(a).click(); // Backup using jquery
      }
      // Delete the temporary link.
      a.parentNode.removeChild(a);
      // Download the next file with a small timeout. The timeout is necessary
      // for IE, which will otherwise only download the first file.
      setTimeout(function() {
        download_next(i + 1);
      }, 500);
    }
    // Initiate the first download.
    download_next(0);
  }
downloadBtn.onclick = (e) => {
    e.preventDefault();
    //This works, or would. Fuck CORS, and fuck GitHub pages not giving you access to LFG files >:(
    /**
     const parent = downloadBtn.parentNode;
    parent.className = "download-disable";
    downloadBtn.setAttribute('value', "Downloading.. (this may take a while)");
    translationTable = []
    let urlTable = []
    getAllSelectedGames().forEach(async (g) => {
        translationTable.push(g.name);
        urlTable.push(g.url);
    });
    downloadAndZip(urlTable,
        () => {
            parent.className = "download";
            downloadBtn.setAttribute('value', "Download as .ZIP");
            console.log("done");
        })
     */
    urlList = []
    getAllSelectedGames().forEach(async (g) => {
        urlList.push({download: g.url, filename: g.name + ".exe"});
    });
    console.log(urlList);
    download_files(urlList);
};
