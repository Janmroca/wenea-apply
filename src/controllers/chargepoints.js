const chargepointService = require("../services/chargepointService.js")
const CHARGEPOINT_STATUS = [ "ready", "charging", "waiting", "error" ]
const NAME_MAX_SIZE = 32

module.exports = {

    createChargepoint: async function (req, res) {
        const { name: name, status: status } = req.body;

        if (!status)
            return res.status(400).send("Status must be specified.")
        if (!CHARGEPOINT_STATUS.includes(status))
            return res.status(400).send("Specified status is not valid.")
        if (!name)
            return res.status(400).send("Name must be specified.")
        if (name.length > NAME_MAX_SIZE) 
            return res.status(400).send(`Name can't be longer than ${NAME_MAX_SIZE} characters.`)
        try {
            chargepointService.findChargepoint({ "name": name })
                .then( chargepoints => {
                    if (chargepoints.length !== 0)
                        return res.status(400).send("Already exists a chargepoint with that name.")
                    
                    chargepointService.createChargepoint(name, status)
                        .then( (id) => res.status(201).send(id.toString()) )
                })
        } catch (error) {
            return res.status(400).send(error)
        }
    },

    deleteChargepoint: async function (req, res) {
        try {
            chargepointService.findChargepoint({ "id": req.params.id })
                .then( chargepoints => {
                    if (chargepoints.length === 0)
                        return res.status(404).send("Doesn't exist a chargepoint with that id.")

                    chargepointService.deleteChargepoint(req.params.id)
                        .then( () => res.status(200).send() )
                })
        } catch (error) {
            return res.status(400).send(error)
        }
    },

    getChargepoints: async function (req, res) {
        return chargepointService.findChargepoint()
            .then( chargepoints =>  { return res.status(200).send(chargepoints) })
            .catch( err => { return res.status(400).send(err) })
    },

    getChargepoint: async function (req, res) {
        return chargepointService.findChargepoint({ "id": req.params.id })
            .then( chargepoints =>  { 
                if (chargepoints[0])
                    return res.status(200).send(chargepoints[0])
                return res.status(404).send("Doesn't exist a chargepoint with that id.")
            })
            .catch( err => { return res.status(400).send(err) })
    },

    updateChargepointStatus: async function (req, res) {
        if (!req.body.status)
            return res.status(400).send("Status must be specified.")

        if (!CHARGEPOINT_STATUS.includes(req.body.status))
            return res.status(400).send("Specified status is not valid.")

        try {
            chargepointService.findChargepoint({ "id": req.params.id })
                .then( chargepoints => {
                    if (chargepoints.length === 0)
                        return res.status(404).send("Doesn't exist a chargepoint with that id.")

                    chargepointService.updateChargepoint(req.params.id, { status: req.body.status })
                        .then( () => res.status(200).send() )
                })
        } catch (error) {
            return res.status(400).send(error)
        }
    }
};