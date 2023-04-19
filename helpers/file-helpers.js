const fs = require('fs')

const localFileHandler = file => {
    return new Promise((resolve, rejects) => {
        if (!file) return resolve(null)

        const fileName = `upload/${file.originalname}`
        return fs.promises.readFile(file.path)
            .then(data => fs.promises.writeFile(fileName, data))
            .then(() => resolve(`/${fileName}`))
            .catch(err => rejects(err))
    })
}

module.exports = {
    localFileHandler
}