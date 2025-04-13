//const { Result } = require("ethers");
import {ethers} from "../chromeapi/node_modules/ethers/dist/ethers.esm.js";
//import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
console.log(ethers);
// Runs when the DOM is fully loaded, sets up event listeners for UI interactions
document.addEventListener("DOMContentLoaded",function(){
    // IN HERE WE RAE GOING TO TARGET THE ELEMENT
    //document.getElementById("accountList").addEventListener("click",changeAccount);//
    //document.getElementById("accountList").addEventListener("click", (event) => {
    //if(document.querySelectorAll(".accountValue")){
        document.body.addEventListener("click", (event) => {
            if (event.target.classList.contains("accountValue")) {
                const address = event.target.getAttribute("data-address");
                const privateKey = event.target.getAttribute("data-privateKey");
                changeAccount(event.target);
                console.log("Clicked Address:", address);
                console.log("Clicked Private Key:", privateKey);
            }else{"the elemt ACCOUNTVALUE DOES NOT EXIST"}
        });
        
//});
    
    document.getElementById("userAddress").addEventListener("click",copyAddress);//
    document.getElementById("transfer_form").addEventListener("click",handler);//
    document.getElementById("header_network").addEventListener("click",getOpenNetwork);//
    document.getElementById("network_item").addEventListener("click",getSelectedNetwork);//
    document.getElementById("add_network").addEventListener("click",setNetwork);//
    document.getElementById("loginAccount").addEventListener("click",login);//
    document.getElementById("loginView").addEventListener("click",loginView);//
    document.getElementById("header_log").addEventListener("click",showOnlyDiv);//
    document.getElementById("accountCreate").addEventListener("click",createUser);//
    document.getElementById("openCreate").addEventListener("click",openCreate);//
    document.getElementById("sign_up").addEventListener("click",signUp);//
    document.getElementById("logout").addEventListener("click",logout);//
    document.getElementById("open_transfer").addEventListener("click",openTransfer);//
    document.getElementById("goBack_import").addEventListener("click",importGoBack);//
    document.getElementById("goBack").addEventListener("click",goBack);//
    document.getElementById("open_import").addEventListener("click",openImport);//
    document.getElementById("open_assets").addEventListener("click",openAssets);//
    document.getElementById("open_activity").addEventListener("click",openActivity);//
    document.getElementById("goHomePage").addEventListener("click",goHomePage);//
    document.getElementById("openAccountImport").addEventListener("click",openImportModel);//
    document.getElementById("close_import_account").addEventListener("click",closeImportModel);
    document.getElementById("add_new_token").addEventListener("click",addToken);//
    document.getElementById("add_New_Account").addEventListener("click",addAccount);//
    
    //NEW
    //document.getElementById("goBack_import").addEventListener("click,importGoBack");//
    
    
    
    
});

//STATE VARIABLES
let providerURL;
if(!localStorage.getItem("providerURL")){
    localStorage.setItem("providerURL",JSON.stringify({name: "Polygone Amoy Testnet",link:'https://rpc-amoy.polygon.technology/'}));
    console.log("providerURL from localstorage : ", localStorage.getItem("providerURL"));
}   
console.log("provider after setting localstorage",localStorage.getItem("providerURL"));
const prov = JSON.parse(localStorage.getItem("providerURL"));
providerURL = prov.link;
    


console.log("provider after setting localstorage",localStorage.getItem("providerURL"));
let provider;
let privateKey;
let address;


//FUNCTIONS 

//test function 

    
    
    
    

// 1 - handler()// Handles fund transfers by creating and sending a transaction using ethers.js.
// Updates the UI and provides a transaction link
async function handler(){
    console.log(document.getElementById("transfer_center").innerHTML);
    document.getElementById("transfer_center").style.display="flex";
    const amount = document.getElementById("amount").value;
    const address = document.getElementById("address").value;
    const private_key = "";
    const testAccount = "";
    const sender = (JSON.parse(localStorage.getItem("userWallet"))).address;
    console.log("sender :",sender);
    //PROVIDER
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    let wallet = new ethers.Wallet("a288ac9b68fa430fc748199a59a0640bb8753e5ed5832204c171ac9ecaa360db",provider);
    const gasPrice = await provider.getGasPrice(); // Get current gas price
    const maxPriorityFeePerGas = ethers.utils.parseUnits("25", "gwei"); // Increase priority fee
    const maxFeePerGas = gasPrice.mul(2); // Ensure total fee is high enough

    const tx = {
        to: address,
        value: ethers.utils.parseEther(amount),
        gasLimit: 21000, 
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        maxFeePerGas: maxFeePerGas,
    };

    let a = document.getElementById("link");
    a.href = "somelink url";

    wallet.sendTransaction(tx).then((txObj)=>{
        console.log("txHash:",txObj.hash);

        document.getElementById("transfer_center").style.display="none";
        const a = document.getElementById("link");
        a.href = `https://mumbai.polygonscan.com/tx/${txObj.hash}`;
        document.getElementById("link").style.display = "block";
    })
    let user = JSON.parse(localStorage.getItem("userWallet"));
    const txData = {
        receiver: address,
        amount: amount
    }
    user.activities.push(txData);
    localStorage.setItem("userWallet",JSON.stringify(user));
    addUserActivity(sender,address,amount);
    addAccountActivity(sender,address,amount);



};
//2 - checkBalance(address) no listener//Fetches the balance of a given address and updates the UI with the balance in MATIC

function checkBalance(address){
    const provider = new ethers.providers.JsonRpcProvider(providerURL);

    provider.getBalance(address).then((balance) => {
        const balanceInEth = ethers.utils.formatEther(balance);

        document.getElementById("accountBalance").innerHTML= `${balanceInEth} MATIC`;

        document.getElementById("userAddress").innerHTML = `${address.slice(0,15)}...`;
    });
};
//3 - getOpenNetwork()// Displays the network selection menu
function getOpenNetwork(){
    document.getElementById("network").style.display = "block";
};
//4 - getSelectedNetwork(e)//Updates the selected network based on the user's choice and sets the appropriate provider URL
function getSelectedNetwork(e){
       const element = document.getElementById("selected_network");
       

    switch (e.target.innerHTML) {
        case "Ethereum Mainnet":
            providerURL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";
            let temp = {
                name:"Ethereum Mainnet",
                link: providerURL
            }
            localStorage.setItem("providerURL",JSON.stringify(temp));
            console.log("Unknown network selected 1");
            break;
        case "Polygone Mainnet":
            providerURL = "https://polygon-rpc.com";
             let temp1 = {
                name:"Polygone Mainnet",
                link: providerURL
            }
            localStorage.setItem("providerURL",JSON.stringify(temp1));
            console.log("Unknown network selected 2");
            break;
        case "Polygone Amoy Testnet":
            providerURL = "https://rpc-amoy.polygon.technology";
            let temp2 = {
                name:"Polygone Amoy Testnet",
                link: providerURL
            }
            localStorage.setItem("providerURL",JSON.stringify(temp2));
            console.log("Unknown network selected 3");
            break;
        case "Goerli Testnet":
            providerURL = "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID";
            let temp3 = {
                name:"Goerli Testnet",
                link: providerURL
            }
            localStorage.setItem("providerURL",JSON.stringify(temp3));
            
            break;
        case "Sepolia Testnet":
            providerURL = "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID";
            let temp4 = {
                name:"Sepolia Testnet",
                link: providerURL
            }
            localStorage.setItem("providerURL",JSON.stringify(temp4));
            
            break;
        default:
            console.log("Unknown network selected");
            break;
    }

    if (e.target.tagName === "SPAN") { // Ensure only <span> elements trigger it
        element.innerHTML = e.target.innerHTML;
        console.log(`e.target.innerHTML : "${e.target.innerHTML}"`);
    }
    document.getElementById("network").style.display = "none";
    

    console.log(providerURL);   
    window.location.reload();
};
//5 - setNetwork()//Hides the network selection menu
function setNetwork(){
    document.getElementById("network").style.display = "none";
};
//6 - loginView()//Shows the login form and hides the account creation form
function loginView(){
    const theNetwork = (JSON.parse(localStorage.getItem("providerURL"))).name;
    document.getElementById("selected_network").innerHTML = theNetwork;
    document.getElementById("createAccount").style.display = "none";
    document.getElementById("LoginUser").style.display = "block";
};
//6 - loginUser()//log the user and show home
function loginAccount(){
    
    document.getElementById("createAccount").style.display = "none";
    document.getElementById("LoginUser").style.display = "block";
};
//7 - createUser()//Similar to loginUser(), but for user registration
function createUser(){
    document.getElementById("createAccount").style.display = "block";
    document.getElementById("LoginUser").style.display = "none";
    
};
//8 - openCreate()//Opens the account creation popup
function openCreate(){
    document.getElementById("createAccount").style.display = "none";
    document.getElementById("create_popUp").style.display = "block";
    
};
//9 - signUp()//Registers a new user by collecting input fields,
// creating a wallet, making an API request, and storing user data in local storage
function signUp(){
    const name = document.getElementById("sign_up_name").value;
    const email = document.getElementById("sign_up_email").value;
    const password = document.getElementById("sign_up_password").value;
    const passwordConfirm = document.getElementById("sign_up_passwordConfirm").value;
    const infos = [];
    const activities = [];

    document.getElementById("field").style.display = `none`;
    document.getElementById("center").style.display = `block`;

    const wallet = ethers.Wallet.createRandom();

    if(wallet.address){
        console.log(wallet);

        //API CALL
        const url = "http://localhost:3000/api/v1/user/signUp";

        const data = {
            name : name,
            email : email,
            password : password,
            passwordConfirm : passwordConfirm,
            address: wallet.address,
            private_key: wallet.privateKey,
            mnemonic : wallet.mnemonic.phrase,
            infos: infos,
            activities: activities,
            
        };
        

        /////////////////////////////////////
        // fetch(url, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(data),
        // })
        // .then(response => {
        //     console.log("Response Status:", response.status);
        //     console.log("Response Headers:", response.headers.get("content-type"));
            
        //     return response.text();  // Get raw response text
        // })
        // .then(text => {
        //     console.log("Raw Response:", text); // Log before parsing
        //     return JSON.parse(text);  // Manually parse
        // })
        // .then(result => {
        //     console.log("Parsed JSON:", result);
        // })
        // .catch(error => {
        //     console.error("Fetch Error:", error);
        // });
        //////////////////////////////////////////////////
        
        
        fetch(url,{
            method: "POST",
           // handlers: {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response)=> response.json()).then((result)=>{
            document.getElementById("createAddress").innerHTML = address;
            document.getElementById("createPrivateKey").innerHTML = wallet.privateKey;
            document.getElementById("createMnemonic").innerHTML = wallet.mnemonic.phrase;
            document.getElementById("center").style.display = "none";
            document.getElementById("accountData").style.display = "block";
            document.getElementById("sign_up").style.display = "none";
            
            const userWallet = {
                address: wallet.address,
                private_key: wallet.privateKey,
                mnemonic: wallet.mnemonic.phrase,
                infos: infos,
                activities: activities,
            };
            const jsonObj = JSON.stringify(userWallet);
            localStorage.setItem("userWallet",jsonObj);

            document.getElementById("goHomePage").style.display = "block";
            window.location.reload();
        
        }).catch((error)=>{
            console.log("ERROR:",error);
        });
    }

};
//10 - login()//Logs in the user by verifying credentials with an API call,
// storing the wallet information, and reloading the page
function login(){
    console.log("rikako");
    document.getElementById("login_form").style.display = "none";
    document.getElementById("createAccount").style.display = "none";
    document.getElementById("center").style.display = "block";

    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;
    console.log("email and pass from the login block : ",email,password);
    //API CALL
    const url = "http://localhost:3000/api/v1/user/logIn";
    const data = {
        email: email,
        password: password
    };

    fetch(url,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
    .then((result) => {
        console.log(result);
        const userWallet = {
            address: result.data.user.address,
            private_key: result.data.user.private_key,
            mnemonic: result.data.user.mnemonic,
            infos: result.data.user.infos,
            activities: result.data.user.activities,
        };

        const jsonObj = JSON.stringify(userWallet);
        console.log("info from data : ",result.data.user.infos);
        localStorage.setItem("userWallet",jsonObj);
        window.location.reload();


    }).catch((error)=>{
        console.log(error);
    });
};
//11 - logout()//Logs out the user by clearing wallet data from local storage and refreshing the page
function logout(){
    localStorage.removeItem("userWallet");
    window.location.reload();
};
//12 - openTransfer()//Displays the fund transfer form and hides the home screen.
function openTransfer(){
    document.getElementById("transfer_form").style.display = "block";
    document.getElementById("home").style.display = "none";

};
//13 - goBack()//Hides the transfer form and shows the home screen
function goBack(){
    document.getElementById("transfer_form").style.display = "none";
    document.getElementById("home").style.display = "block";

};
//14 - openImport()//Displays the token import form and hides the home screen.
function openImport(){
    document.getElementById("import_token").style.display = "block";
    document.getElementById("home").style.display = "none";

};
//15 - importGoBack()//Closes the token import form and returns to the home screen.
function importGoBack(){
    document.getElementById("import_token").style.display = "none";
    document.getElementById("home").style.display = "block";

};
//16 - openActivity()//Shows the activity section and hides the assets section
function openActivity(){
    document.getElementById("activity").style.display = "block";
    document.getElementById("assets").style.display = "none";

};
//17 - openAssets()//Shows the assets section and hides the activity section
function openAssets(){
    document.getElementById("activity").style.display = "none";
    document.getElementById("assets").style.display = "block";

};
//18 - goHomePage() //Closes the account creation popup and returns to the home screen.
function goHomePage(){
    document.getElementById("create_popUp").style.display = "none";
    document.getElementById("home").style.display = "block";

};
//19 - openImportModel()//Opens the account import model and hides the home screen.
function openImportModel(){
    
    const str = localStorage.getItem("userWallet");
    const parseObj = str ? JSON.parse(str) : {}; //const parseObj = JSON.parse(str);
    if(!parseObj?.address){
        console.log("no current user found ");
    }else{
    console.log("the current user : ", parseObj.address);
    }
    const address = parseObj.address;
    const url = `http://localhost:3000/api/v1/account/retrieveAccount?address=${encodeURIComponent(address)}`;
    fetch(url,{
        method: "GET",      
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if(data.status){
            console.log("retrieve function is working!!",data.data.infos);
            const userWallet = {
                address: data.data.address,
                private_key:data.data.privateKey,
                mnemonic: "Changed",
                infos:data.data.infos,
            }
        
            const jsonObj = JSON.stringify(userWallet);
            localStorage.setItem("userWallet",jsonObj);
            //window.location.reload();
        }else{
            console.log("not imported account!!");
        }
       
    }
    )
    .catch((error) => {
        console.error("Fetch Error:", error);
    });
    document.getElementById("import_account").style.display = "block";
    document.getElementById("home").style.display = "none";

};
//20 - closeImportModel()//Closes the account import model and returns to the home screen.
function closeImportModel(){
    document.getElementById("import_account").style.display = "none";
    document.getElementById("home").style.display = "block";

};
//21 - addToken()// Collects token details (address, name, symbol) and sends an API request to add a new token
function addToken(){
    const address = document.getElementById("token_address").value;
    const name = document.getElementById("token_name").value;
    const symbol = document.getElementById("token_symbol").value;
    const str = localStorage.getItem("userWallet");
    const parseObj = str ? JSON.parse(str) : {}; //const parseObj = JSON.parse(str);
    if(!parseObj?.address){
        console.log("no current user found ");
    }else{
    console.log("the current user : ", parseObj.address);
    }
    //API call 

    const url = "http://localhost:3000/api/v1/tokens/createToken";
    const data = {
        name: name,
        address: address,
        symbol: symbol,
    };

    fetch(url,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
    .then((result) => {
        
        // Ensure parseObj.infos is an array before pushing
    if (Array.isArray(parseObj.infos)) {
        console.log("token id : ",result.data.createToken._id);
        parseObj.infos.push(result.data.createToken._id);
        localStorage.setItem("userWallet", JSON.stringify(parseObj));
    } else {
        console.error("Error: parseObj.infos is not an array!");
    }
        updateInfos(result.data.createToken._id);
        
        
       //window.location.reload();
    }).catch((error)=>{
        console.log(error);
    });
};
//22 - addAccount()//Imports an account using a private key, creates a wallet, and sends an API request to add the account.
function addAccount(){
    console.log("adding an account");
    const str = localStorage.getItem("userWallet");
    const parseObj = str ? JSON.parse(str) : {}; //const parseObj = JSON.parse(str);
    if(!parseObj?.address){
        console.log("no current user found ");
    }else{
    console.log("the current user : ", parseObj.address);
    }
    const privateKey = document.getElementById("add_account_private_key").value.trim();
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    let wallet = new ethers.Wallet(privateKey,provider);
    console.log(wallet);
    const url = "http://localhost:3000/api/v1/account/createAccount";
    const data = {
        privateKey: privateKey,
        address: wallet.address,
        infos: [],
        activities:[],
       
    };

    fetch(url,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
    .then((result) => {
        console.log(result.data.account._id);
        // Ensure parseObj.infos is an array before pushing
    if (Array.isArray(parseObj.infos)) {
        console.log("account id : ",result.data.account._id);
        parseObj.infos.push(result.data.account._id);
        localStorage.setItem("userWallet", JSON.stringify(parseObj));
    } else {
        console.error("Error: parseObj.infos is not an array!");
    }
    try{
        updateInfos(result.data.account._id);
    }
    catch(error){
        console.error("the object is not a user",error);
    }
    try{
        updateAccountInfos(result.data.account._id);
    }catch(error){
        console.error("the object is not an account",error);
    }
        
        
        
       
    }).catch((error)=>{
        console.log(error);
    });
};
//23 - myFunction() no listener : Runs on page load, checks for a saved wallet in local storage,
// updates the UI, fetches token and account data from APIs, and displays them in the UI.
function myFunction(){
    const provURL = JSON.parse(localStorage.getItem("providerURL"));
    const temp = JSON.parse(localStorage.getItem("providerURL"));
    
        document.getElementById("selected_network").innerHTML = provURL.name;
        console.log("provURL.name : ",provURL.name);
    
    //console.log(ethers);
    const str = localStorage.getItem("userWallet");
    const parseObj = str ? JSON.parse(str) : {}; //const parseObj = JSON.parse(str);
    console.log("the current user : ", parseObj.address);
    if(parseObj?.address){
        document.getElementById("LoginUser").style.display = "none";
        document.getElementById("createAccount").style.display = "none";
        document.getElementById("home").style.display = "block";

        privateKey = parseObj.privateKey;
        address = parseObj.address;
        
        checkBalance(parseObj.address);


    }

    const tokenRender = document.querySelector(".assets");
    const accountRender = document.querySelector(".accountList");

    const url = "http://localhost:3000/api/v1/tokens/allToken";
    

    fetch(url).then((response) => response.json())
    .then((data) => {
        let element = "";
        data.data.tokens.map((token)=> {
            
        if(parseObj.infos.includes(token._id)){
            console.log("infos : ",parseObj.infos);
            element +=`
        <div class="assets_item">
          <img class="assets_item_img"
          src="./assets/theblockchaincoders.png" 
          alt=""  
          />

          <span>${token.address.slice(0,15)}...</span>
          <span>${token.symbol}</span>
        </div>
        `;
    }
        
    });
    
    tokenRender.innerHTML = element;
         
    }).catch((error)=>{
        console.log(error);
    });
    
    fetch("http://localhost:3000/api/v1/account/allAccount")  // Ensure correct URL case
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        let accounts = data.data.accounts.filter(account => parseObj.infos.includes(account._id)) // Only keep accounts in parseObj.infos
        .map((account, i) => 
        `<div class="lists">
          <p>${i + 1}</p>
          <p class="accountValue" data-address="${account.address}" 
          data-privateKey="${account.privateKey}">${account.address.slice(0, 15)}...</p>
        </div>
        `
    ).join("");  // Join array elements into a single string
    
        console.log("the accounts  : ",accounts);
        accountRender.innerHTML = accounts;  // Ensure 'accountRender' is defined in your HTML
    }
    )
    .catch((error) => {
        console.error("Fetch Error:", error);
    });

    ///////////////////////////
    const activityArray = JSON.parse(localStorage.getItem("userWallet"));
    const activityElement = document.getElementById("activity");
    activityArray.activities.forEach(activity => {
        let temp = ethers.utils.parseEther(activity.amount);
        console.log("amount on ether : ",temp);
        let assetHTML = `
            <div class="assets_item">
                <img src="./assets/theblockchaincoders.png" alt="" class="assets_item_img">
                <span>${activity.receiver}</span> 
                <span>${activity.amount} MATIC</span> 
            </div>
        `;
        activityElement.innerHTML += assetHTML;
    });

    //SECURITY ISSUE
    if (privateKey) {
        console.log(privateKey);
    }

};
//24 - copyAddress()//Copies the user’s wallet address to the clipboard
function copyAddress(){
    navigator.clipboard.writeText(address);
};
//25 - changeAccount()//Changes the active account by selecting data from the UI, updates local storage, and refreshes the page

function changeAccount(element){
    //const data = document.querySelectorAll(".accountValue");
    //console.log(data);
    const address = element.getAttribute("data-address");
    const privateKey = element.getAttribute("data-privateKey");
    console.log("changing the account to : ",privateKey,address);
    const data = {
        address: address,
    }
    // const url = `http://localhost:3000/api/v1/account/retrieveAccount`;//?address=${encodeURIComponent(address)}`;
    // fetch(url,{
    //     method: "GET",      
    // }).then((response) => {
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     return response.json();
    // })
    // .then((data) => {
    //    console.log(data);
    // }
    // )
    // .catch((error) => {
    //     console.error("Fetch Error:", error);
    // });
       
      
    
    const userWallet = {
        address: address,
        private_key:privateKey,
        mnemonic: "Changed",
        infos:[],
        activities:[]
    }

    const jsonObj = JSON.stringify(userWallet);
    localStorage.setItem("userWallet",jsonObj);
    window.location.reload();
};
//26 - showOnlyDiv()//show the login view and hide all other views
function showOnlyDiv() {
    document.querySelectorAll("div").forEach(div => {
        if (div.id === "LoginUser") {
            div.style.display = "block"; // Show the target div
        } else if (div.id === "createAccount" || div.id === "create_popUp" || div.id === "transfer_form" || div.id === "import_token"|| div.id === "import_account" || div.id === "home" ){
            div.style.display = "none";  // Hide all others
        }
    });
    
}
//27 - updating the array infos in the Token collection 
async function  updateInfos(newInfo){
    const str = localStorage.getItem("userWallet");
    const parseObj = str ? JSON.parse(str) : {}; //const parseObj = JSON.parse(str);
    if(!parseObj?.address){
        console.log("no current user found ");
    }else{
    console.log("the current user : ", parseObj.address);
    }
     
        try {
            const response = await fetch(`http://localhost:3000/api/v1/user/updateInfos`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ infos: newInfo , address: parseObj.address}),
            });
    
            const result = await response.json();
            console.log("Updated user:", result);
        } catch (error) {
            console.error("Error updating token:", error);
        }
    

    
}
async function  updateAccountInfos(newInfo){
    const str = localStorage.getItem("userWallet");
    const parseObj = str ? JSON.parse(str) : {}; //const parseObj = JSON.parse(str);
    if(!parseObj?.address){
        console.log("no current user found ");
    }else{
    console.log("the current user : ", parseObj.address);
    }
     
        try {
            const response = await fetch(`http://localhost:3000/api/v1/account/updateAccountInfos`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ infos: newInfo , address: parseObj.address}),
            });
    
            const result = await response.json();
            console.log("Updated user:", result);
        } catch (error) {
            console.error("Error updating token:", error);
        }
    

    
}
function addUserActivity(sender,receiver,amount){
    const url = "http://localhost:3000/api/v1/user/addUserActivity";
    const txSenderAddress = sender;
    
    const txReceiverAddress = receiver;
    const txAmount = amount;
    console.log("sender : ",txSenderAddress,"receiver : ",txReceiverAddress,"amount : ",txAmount);
    const data = {
        sender: txSenderAddress,
        receiver: txReceiverAddress,
        amount: amount,
    };
     fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            console.log("Response Status:", response);
            
            
            return response.text();  // Get raw response text
        })
        .then(text => {
            console.log("Raw Response:", text); // Log before parsing
            return JSON.parse(text);  // Manually parse
        })
        .then(result => {
            console.log("Parsed JSON:", result);
        })
        .catch(error => {
            console.error("Fetch Error:", error);
        });
}
function addAccountActivity(sender,receiver,amount){
    const url = "http://localhost:3000/api/v1/account/addAccountActivity";
    const txSenderAddress = sender;
    
    const txReceiverAddress = receiver;
    const txAmount = amount;
    console.log("sender : ",txSenderAddress,"receiver : ",txReceiverAddress,"amount : ",txAmount);
    const data = {
        sender: txSenderAddress,
        receiver: txReceiverAddress,
        amount: amount,
    };
     fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            console.log("Response Status:", response);
            
            
            return response.text();  // Get raw response text
        })
        .then(text => {
            console.log("Raw Response:", text); // Log before parsing
            return JSON.parse(text);  // Manually parse
        })
        .then(result => {
            console.log("Parsed JSON:", result);
        })
        .catch(error => {
            console.error("Fetch Error:", error);
        });
}


window.onload = myFunction;





