/**
 * Reddit Punchcard
 * 
 * Mohammed Sohail <sohailsameja@gmail.com>
 */


function renderPunchcard() {
    
    const username = document.getElementById("username").value;

    getRedditData(username, (error, ctx) => {
        if (error) {
            alert(error);
        }
        const scalingFactor = 7;
        const weightObject = _.countBy(ctx, _.identity);
        const keys = Object.keys(weightObject);
        const values = Object.values(weightObject);

        const parsedKeys = [];

        for (let i = 0; i < keys.length; i++) {
            const split = keys[i].split(",");

            for (let j = 0; j < 2; j++) {
                parsedKeys.push(parseInt(split[j]));
            }
        }

        const chunkedKeys = _.chunk(parsedKeys, 2);

        for (let i = 0; i < chunkedKeys.length; i++) {
            chunkedKeys[i].push(parseInt(values[i] * scalingFactor));
        }

        const chart = punchcard({ target: '#reddit', width: 800 });

        chart.render(chunkedKeys);
    });
};

function getRedditData(username, callback) {
    const returnArray = [];

    axios.get(`https://www.reddit.com/user/${username}/.json?limit=100`).then(result => {
        console.log(result.data.data.children.length)
        _.each(result.data.data.children, (object) => {
            const timestamp = object.data.created_utc;

            const date = new Date(parseInt(`${timestamp}000`));
            const day = date.getDay();
            const hour = date.getHours();

            returnArray.push([day, hour])
        });
        return callback(null, returnArray)
    }).catch(error => {
        return callback(error);
    });
}