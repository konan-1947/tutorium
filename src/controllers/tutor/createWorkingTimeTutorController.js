const workingTimeService = require('../../services/tutor/createWorkingTimeTutorService');


exports.createWorkingTime = async (req, res) => {
    try {
        //const userId =  req.session.user.userid;
          const userId = 24;
        const { newStartTime, newEndTime } = req.body;

        if (!userId || !newStartTime || !newEndTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

       
        const workingTime = await workingTimeService.createWorkingTime({ userId, newStartTime, newEndTime });

        console.log("hahahaha", workingTime.error);
        if(workingTime.error){
            return res.status(400).json({ message: workingTime.error });
        }
        
     
        return res.status(200).json({ message: 'Working time created successfully', data: workingTime });
    } catch (error) {
        console.error('Error creating working time:', error);
        return res.status(400).json({ message: error });
    }
};