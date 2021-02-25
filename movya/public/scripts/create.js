document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, "browser-default");
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {
        format: 'yyyy-mm-dd'
    });

    document.getElementById('button').addEventListener('click', create);
});

function create(e) {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const vehicleType = document.querySelector('#vehicleType').value;
    const description = document.querySelector('#description').value;
    const location = document.querySelector('#location').value;
    const rules = document.querySelector('#rules').value;
    const numOccupants = document.querySelector('#numOccupants').value;
    const concierge = document.querySelector('#concierge').value;
    const self_drive = document.querySelector('#self-drive').value;
    const host_photo = document.querySelector('#host_photo');
    const car_photo = document.querySelector('#car_photo');
    const date1 = document.querySelector('#date1').value;
    const date2 = document.querySelector('#date2').value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("vehicleType", vehicleType);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("rules", rules);
    formData.append("numOccupants", numOccupants);
    formData.append("concierge", concierge);
    formData.append("self_drive", self_drive);
    formData.append("photos", host_photo.files[0])
    formData.append("photos", car_photo.files[0])
    formData.append("dates_available", date1);
    formData.append("dates_available", date2);

    console.log(formData);

    fetch('/api/v1/createlisting', {
        method: 'post',
        body: formData
    })

    .then(response => response.json())
    .then(result => {
        const success = result['success'];
        const error = result['error'];

        console.log("Success: ", success);
        console.log("Error: ", error);
        

        if (!success) document.getElementById('error').innerHTML = error;
        if (success) {
            //window.location.href = "/mylistings";
            console.log(success);
        };
    })

}