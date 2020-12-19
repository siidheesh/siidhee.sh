// author: siidheesh
// i love state machines

const linkRegex = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
const mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}();

const states = Object.freeze({
    INIT: 'INIT',
    TYPE_INPUT: 'TYPE_INPUT',
    ENTER_INPUT: 'ENTER_INPUT',
    DISPLAY_OUTPUT: 'DISPLAY_OUTPUT',
    FIN: 'FIN'
});
const gitStates = Object.freeze({
    INIT: 'INIT',
    TYPE_INPUT: 'TYPE_INPUT',
    DELETE_INPUT: 'DELETE_INPUT',
});
const prompts = Object.freeze({
    DEFAULT: '<b><span class="green">guest@' + (navigator.platform ? navigator.platform.replace(/\s+/g, '-').toLowerCase() : 'guest') + '</span><span class="blue">~</span></b>$ ',
    SSH: '<b><span class="green"><blur>unknown</blur>@siidhee.sh:</span><span class="blue">~</span></b>$ ',
    PROJECTS: '<b><span class="green"><blur>unknown</blur>@siidhee.sh:</span><span class="blue">~/projects</span></b>$ '
});

let gitProjects = [{ "gitName": "ARMsat.git", "cloneUrl": "https://github.com/siidheesh/ARMsat.git" }, { "gitName": "EE2020.git", "cloneUrl": "https://github.com/siidheesh/EE2020.git" }, { "gitName": "EE2024.git", "cloneUrl": "https://github.com/siidheesh/EE2024.git" }, { "gitName": "FDP2002.git", "cloneUrl": "https://github.com/siidheesh/FDP2002.git" }];
let gitReady = false;

let con = document.getElementById('console');
let lines = [];
let currentLine = 0;
let currentPos = 0;
let currentGitLine = 0;
let currentGitPos = 0;

let currentState = states.INIT;
let currentGitState = gitStates.INIT;

const isFirstTime = location.search == "?s" || function() {
    const KEY = "siidhee.sh",
          VALUE = "you've previously visited siidhee.sh v0.0.1"
    const myStorage = window.localStorage;
    if (localStorage.getItem(KEY) == VALUE) {
        return false;
    } else {
        localStorage.setItem(KEY, VALUE);
        return true;
    }
}();

function stateMachine() {
    switch (currentState) {
        case states.INIT:
            fetchGitHubRepos();
            let lastPrompt = prompts.DEFAULT;
            for (const i in [...con.children]) {
                let line = con.children[i];
                const isInput = line.classList.contains("in");
                if (line.hasAttribute("prompt"))
                    lastPrompt = prompts[line.getAttribute("prompt")];
                lines.push({
                    isInput: isInput,
                    payload: isInput ? line.innerText : line.innerHTML,
                    prompt: lastPrompt ? lastPrompt : prompts.DEFAULT,
                    isGit: line.hasAttribute("git")
                });
            }
            con.innerHTML = prompts.DEFAULT;
            currentLine = 0;
            currentPos = 0;
            if (lines.length) {
                currentState = lines[currentLine].isInput ? states.TYPE_INPUT : states.DISPLAY_OUTPUT;
                if(!isFirstTime) {
                    con.innerHTML = "Resuming previous session...\n" + prompts.DEFAULT;
                    setTimeout(stateMachine, 1000);
                } else setTimeout(stateMachine, 1000);
            }
            break;
        case states.TYPE_INPUT:
            con.innerHTML += lines[currentLine].payload[currentPos];
            currentPos += 1;
            if (currentPos >= lines[currentLine].payload.length) {
                currentPos = 0;
                if (!lines[currentLine].isGit) {
                    currentState = states.ENTER_INPUT;
                    setTimeout(stateMachine, isFirstTime ? 250 : 0);
                } else {
                    currentState = states.FIN;
                    setTimeout(stateMachine, isFirstTime ? 250 : 0);
                }
            } else setTimeout(stateMachine, isFirstTime ? 50 : 0);
            break;
        case states.ENTER_INPUT: {
            let l = con.innerHTML.split('\n');
            l[l.length - 1] = '<span class="green">></span> ' + lines[currentLine].payload.replace(linkRegex, "<a href='$1'>$1</a>");;
            con.innerHTML = l.join('\n');
            currentLine += 1;
            if (currentLine < lines.length) {
                currentState = lines[currentLine].isInput ? states.TYPE_INPUT : states.DISPLAY_OUTPUT;
                if (currentState == states.TYPE_INPUT) {
                    con.innerHTML += '\n' + lines[currentLine].prompt;
                }
                setTimeout(stateMachine, isFirstTime ? 1000 : 0);
            }
            break;
        }
        case states.DISPLAY_OUTPUT:
            if (lines[currentLine].isInput) debugger;
            con.innerHTML += '\n' + lines[currentLine].payload;
            currentLine += 1;
            if (currentLine < lines.length) {
                currentState = lines[currentLine].isInput ? states.TYPE_INPUT : states.DISPLAY_OUTPUT;
                if (currentState == states.TYPE_INPUT) {
                    con.innerHTML += '\n' + lines[currentLine].prompt;
                }
                setTimeout(stateMachine, isFirstTime ? 1000 : 0);
            }
            break;
        case states.FIN: {
            let l = con.innerHTML.split('\n');
            l[l.length - 1] = l[l.length - 1].replace(linkRegex, "<a href='$1'>$1</a>");;
            con.innerHTML = l.join('\n');
            gitStateMachine();
            break;
        }
        default:
            break;
    }

}

function gitStateMachine() {
    switch (currentGitState) {
        case gitStates.INIT:
            if (!gitReady) {
                setTimeout(gitStateMachine, 500);
                break;
            }
            if (!mobileCheck)
                document.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter' || event.keyCode == 13)
                        location.href = gitProjects[currentGitLine].cloneUrl;
                });
            currentGitState = gitStates.TYPE_INPUT;
        case gitStates.TYPE_INPUT:
            con.innerHTML += gitProjects[currentGitLine].gitName[currentGitPos];
            currentGitPos += 1;
            if (currentGitPos >= gitProjects[currentGitLine].gitName.length) {
                currentGitState = gitStates.DELETE_INPUT;
                setTimeout(gitStateMachine, 2000);
            } else setTimeout(gitStateMachine, 50);
            break;
        case gitStates.DELETE_INPUT:
            con.innerHTML = con.innerHTML.slice(0, -1);
            currentGitPos -= 1;
            if (currentGitPos == 0) {
                currentGitLine = currentGitLine < gitProjects.length - 1 ? currentGitLine + 1 : 0;
                currentGitState = gitStates.TYPE_INPUT;
                setTimeout(gitStateMachine, 500);
            } else setTimeout(gitStateMachine, 75);
            break;
        default:
            break;
    }
}

function fetchGitHubRepos() {
    let xhr = new XMLHttpRequest();

    // 2. Configure it: GET-request for the URL /article/.../load
    xhr.open('GET', 'https://api.github.com/users/siidheesh/repos');

    // 3. Send the request over the network
    xhr.send();

    // 4. This will be called after the response is received
    xhr.onload = function () {
        if (xhr.status == 200) {
            const data = JSON.parse(xhr.response);
            gitProjects = data ? Array.from(data, elem => new Object({ gitName: elem.name + ".git", cloneUrl: elem.clone_url })) : gitProjects;
        }
        gitReady = true;
    };

    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            console.log(`Received ${event.loaded} of ${event.total} bytes`);
        } else {
            console.log(`Received ${event.loaded} bytes`); // no Content-Length
        }

    };

    xhr.onerror = function () {
        console.log("github api request failed");
    };
};

stateMachine();
