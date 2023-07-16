const express = require("express");
const myError = require("./myError")
const app = express();
const fs = require('fs');

const order = function(nums){
    newNums = [];
    for(let num of nums){
        if(newNums.length==0){
            newNums.push(parseFloat(num));
        } else{
            let done = false;
            for(let i = 0; i<newNums.length&&done==false;i++){
                if(num >= newNums[i] && !newNums[i+1]){
                    newNums.push(parseFloat(num));
                    done=true;
                }else if(num <= newNums[i] && i==0){
                    newNums.splice(0,0,parseFloat(num));
                    done=true;
                }else if(num >= newNums[i] && num <= newNums[i+1]){
                    newNums.splice(i+1,0,parseFloat(num));
                    done = true;
                }
            }
        }
    }
    return newNums;
}
const mean = function(nums){
    let total = 0;
    for(let num of nums){
        total = total+parseFloat(num);
    }
    return total/nums.length;
}
const median = function(nums){
    if((nums.length / 2)-Math.floor(nums.length/2)!=0){
        console.log(nums.length/2)
        return (parseFloat(nums[Math.floor(nums.length/2)]));
    }else{
        return (parseFloat(nums[Math.floor(nums.length/2)])+parseFloat(nums[Math.floor(nums.length/2)-1]))/2;
    }
}
const mode = function(nums){
    count = {};
    for(let num of nums){
        if(!count[num]){
            count[num] = 1;
        }else{
            count[num] = count[num]+1;
        }
    }
    let highestCount=[]
    for(let num in count){
        if (highestCount.length==0){
            highestCount.push(num);
        } else if (count[num]>count[highestCount[0]]){
            highestCount = [];
            highestCount.push(num);
        } else if(count[num]==count[highestCount[0]]){
            highestCount.push(num);
        }
    }
    return mean(highestCount);
}
const checkNums = function(nums){
    console.log(nums.length)
    if(nums.length <=1 && nums[0]==""){
        return 'numbers are required';
    }
    for (let num of nums){
        console.log(parseFloat(num))
        if (!parseFloat(num)){
            console.log('Nan')
            return `${num} is not a number`;
        }
    }
    return false;
}

const writeFile = function(write, obj){
    msg = JSON.stringify(obj) + new Date() + "\n";
    if(write=='true'){
        fs.stat(`./results.json`, function(err, stat){
            if(err==null){
                fs.readFile(`./results.json`, 'utf8', function(err,data){
                    if(err){
                        console.error(err);
                        process.exit(1);
                    }
                    fs.writeFile(`./results.json`, `${data}${msg}`, "utf8", function(err){
                        if(err){
                            console.log(err);
                            process.exit(1);
                        }
                        console.log('File written successfully')
                    })
                })
            }else if(err.code==='ENOENT'){
                fs.writeFile(`./results.json`, `${msg}`, "utf8", function(err){
                    if(err){
                        console.log(err);
                        process.exit(1);
                    }
                    console.log('File written successfully')
                })
            }else{
                console.log(err);
                process.exit(1);
            }
        })
}
}

app.get('/mean', function(request, response){
    let nums = request.query.nums.split(',');
    if(checkNums(nums)){
        console.log('error');
        throw new myError(checkNums(nums), 400);
    }
    data = {operation:'mean', value: mean(nums)};
    writeFile(request.query.save, data);
    return response.send(data);
})
app.get('/order', function(request, response){
    let nums = request.query.nums.split(',');
    if(checkNums(nums)){
        console.log('error');
        throw new myError(checkNums(nums), 400);
    }
    data = {operation:'order', value: order(nums)};
    writeFile(request.query.save, data);
    return response.send(data);
})
app.get('/median', function(request, response){
    let nums = request.query.nums.split(',');
    if(checkNums(nums)){
        console.log('error');
        throw new myError(checkNums(nums), 400);
    }
    data = {operation:'median', value: median(order(nums))};
    writeFile(request.query.save, data);
    return response.send(data);
})
app.get('/mode', function(request, response){
    let nums = request.query.nums.split(',');
    if(checkNums(nums)){
        console.log('error');
        throw new myError(checkNums(nums), 400);
    }
    data = {operation:'mode', value: mode(order(nums))};
    writeFile(request.query.save, data);
    return response.send(data);
})
app.get('/all', function(request, response){
    let nums = request.query.nums.split(',');
    if(checkNums(nums)){
        console.log('error');
        throw new myError(checkNums(nums), 400);
    }
    console.log(request.query.save);
    data = {operation:'all', mean: mean(order(nums)),median: median(order(nums)),mode: mode(order(nums))};
    writeFile(request.query.save, data);
    return response.send(data);
})
app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
});
app.use(function(err, req, res, next) {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.message;
  
    // set the status and alert the user
    return res.status(status).json({
        error: {message, status}
    });
});
app.listen(3000, function(){
  console.log('App on port 3000');
}) 
