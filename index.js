const games = document.getElementsByClassName("games")[0]
let translationTable = []
const downloadBtn = document.getElementById("download-click");
const download = url => {
    return fetch(url).then(resp => resp.blob());
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
    game("Five Nights At Freddys 1 (225MB)", "/thebigfloyd/cdn/FiveNightsAtFreddys.exe"),
    game("Five Nights At Freddys 2 (212MB)", "/thebigfloyd/cdn/FiveNightsAtFreddys2.exe"),
    game("Five Nights At Freddys 3 (111MB)", "/thebigfloyd/cdn/FiveNightsAtFreddys3.exe"),
    game("FNAF Ultimate Custom Night (268MB)", "/thebigfloyd/cdn/FNAFUltimateCustomNight.exe"),
    game("Halo: Combat Evolved (99MB)", "/thebigfloyd/cdn/HaloCombatEvolved.exe"),
    game("Counter Strike Source (102MB)", "/thebigfloyd/cdn/CounterStrikeSource.exe"),
    game("Powder Toy (5MB)", "/thebigfloyd/cdn/PowderToy.exe"),

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


downloadBtn.onclick = (e) => {
    e.preventDefault();
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
};
