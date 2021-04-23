const store = require('data-store')({path : process.cwd()+'/db.json'});
const lockfile = require('proper-lockfile');
const sizeof = require('object-sizeof');

//create function to add key value pair
function create(key,value,timeout = 0){
    lockfile.lock(filePath)
                .then(async(release) => {

                    if(typeof key != 'string' || key.length > 32){
                        console.log("Invalid key type. Please enter a string key"); //error
                    }
                    else if(store.has(key))
                    console.log("The key is already present");
                    
                    else{
                        var l;
                        if(timeout == 0){
                            curObj =[value,timeout];
                        }
                        else{
                            var time = (new Date()).getTime()/1000;
                            curObj = [value,time+timeout];
                        }
                        if(key.length <= 32){
                            store.set(key,l);
                        }
                        // Object memory size check
                        if(sizeof(curObj)>16000)
                        {
                          console.log("Object size exceeded.");
                        }
                   
                    }
                    lockfile.unlock(filePath);
                    release
                })
                .catch(err){
                    throw new Error("Failed saving data, or file moved or deleted")
                }
            }
                
//read function to read a value of an existing key
function read(key){
    lockfile.lock(filePath)
               .then(async(release) => {
                    console.log("locking")
                   if(store.has(key)){
                       var b = store.get(key);
                       if(b[1]!=0){
                           var time = (new Date()).getTime()/1000;
                           if(time < b[1]){
                               console.log(store.get(key));
                            }
                            else{
                                console.log("Time-To-Live for "+key+" has expired"); //error
                            }
                        }
                        else{
                            console.log(store.get(key));
                        }
                    }
                    else{
                        console.log("The key does not exist. Please create first.") //error
                    }
                    lockfile.unlock(filePath);
                    release
                })
                .catch((err)=>{
                    throw new Error("Failed saving data, or file moved or deleted")
                 
                })
                }
                
                //function to delete an existing key
function deletekey(key){
    lockfile.lock(filePath)
    .then(async(release) => {
        console.log("locking")
        if(store.has(key)){
            var b = store.get(key);
            if(b[1]!=0){
                var time = (new Date()).getTime()/1000;
                if(time < b[1]){
                    store.del(key);
                    console.log("Successfully deleted the key and value");
                }
                else{
                    store.del(key);
                    console.log("Time-To-Live for "+key+" has expired"); //error
                }
        }
        else{
            store.del(key);
            console.log("Successfully deleted the key and value");
        }
    }
    else{
        console.log("No such key found"); //error
    }
}).catch((err)=>{
    throw new Error("Failed saving data, or file moved or deleted")
 
})
}
//exporting to make the functionality accessible outside the module
module.exports.store = store;
module.exports.create = create;
module.exports.read = read;
module.exports.deletekey = deletekey;