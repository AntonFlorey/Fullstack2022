import axios from 'axios'

const GetServerData = (adress, ResponseHandler) => {
    axios.get(adress).then(response => {
        ResponseHandler(response)
    })
}

const UpdateServerData = (adress, data, ResponseHandler, ErrorHandler) => {
    axios.post(adress, data).then(response => {
        ResponseHandler(response)
    }).catch(err => {
        ErrorHandler(err)
    })
}

const DeleteServerData = (adress, id, ResponseHander, deleteMSG, ErrorHandler) => {
    if (window.confirm(deleteMSG)){
        axios.delete(adress + "/" + String(id)).then(response => {
            ResponseHander(response)
        }).catch(err => {
            ErrorHandler(err)
        })
    }
}

const PutServerData = (adress, id, data, ResponseHandler, ErrorHandler) => {
    axios.put(adress + "/" + String(id), data).then(response => {
        ResponseHandler(response)
    }).catch(err => {
        ErrorHandler(err)
    })
}

export {GetServerData, UpdateServerData, DeleteServerData, PutServerData}