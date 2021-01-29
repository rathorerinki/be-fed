
import React, { useEffect, useState,useRef } from "react";
import PropTypes from 'prop-types';
import { makeStyles,Theme, createStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import apiCtr from './apiCtr';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [name, setMyName] = useState('') ;
  const [email, setMyEmail] = useState('') ;
  const [mobile, setMyMobile] = useState('') ;
  const [placeName, setMyAddress] = useState('') ;
  const [allUser, setAllUser] = useState([]) ;

  const [editName, setEditName] = useState('') ;
  const [editEmail, setEditEmail] = useState('') ;
  const [editMobile, setEditMobile] = useState('') ;
  const [editPlaceName, setEditAddress] = useState('') ;
  const [_id, setMy_id] = useState("") ;
  const [GoogleMapInfo, setGoogleMapInfo] = useState(Object) ;
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const googleMapRef = useRef();

    let googleMap;

    useEffect(() => {
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB9stNP2UYOkJCJkR2CfnabPiNP6g08UH8&libraries=places`;
      googleMapScript.async = true;
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener("load", () => {
        getLatLng("");
      });

      // get user list 
    apicalling();

    }, []);
  
  const apicalling=()=>{
    let data;
    apiCtr.get(data,'user',(resulData)=>{
      console.log("Get data  ->",resulData.data);
      setAllUser(resulData.data)
    })
  }

  const getLatLng = (placeName) => {
   
    let lat, lng, placeId;
    new window.google.maps.Geocoder().geocode({ 'address': `${placeName}` }, function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
            placeId = results[0].place_id;

            createGoogleMap(results[0].geometry.location);
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            new window.google.maps.Marker({
                position: { lat, lng },
                map: googleMap,
                animation: window.google.maps.Animation.DROP,
                title: `${placeName}`
            });
            setGoogleMapInfo({ ...GoogleMapInfo, lat, lng, placeId, isLoading: false, googleMap });
        } else {
            // alert('Geocode was not successful for the following reason: ' + status);
        }
      })
    }

  const changed=(place)=>{
    getLatLng(place);
  }

    const createGoogleMap = (coordinates) => {
        googleMap = new window.google.maps.Map(googleMapRef.current, {
          zoom: 16,
          center: {
              lat: coordinates.lat(),
              lng: coordinates.lng(),
          },
          disableDefaultUI: true,
      })
    
  };

  const save=()=>{
    let data={};
    if(_id==''){
      if(name=='' && email=='' && mobile=='' && placeName=='' ){
        swal({
          title: "Error!",
          text: "Please fill all the fields",
          icon: "error",
        });
        return false;
      } 
       else{        
        data.fname=name;
        data.email=email;
        data.phone=mobile;
        data.address=placeName;

        apiCtr.post(data,'user',(resulData)=>{
          console.log("res   ->",resulData.data);
          let promise= new Promise((next)=>{
            next();
          })
          promise.then(()=>{
            cancel();            
          })                  
        })
      }
   }
   else{
    data._id=_id;
    data.fname=editName;
    data.email=editEmail;
    data.phone=editMobile;
    data.address=editPlaceName;
    console.log("data ",data)
    apiCtr.put(data,'user/'+_id,(resulData)=>{
      console.log("res   ->",resulData.data);
      let promise= new Promise((next)=>{
        next();
      })
      promise.then(()=>{
        setOpen(false);
        apicalling();
      })
    
    })
  }
  
  }

  const deleteUser=(event,id)=>{
  // Delete user  
  
    if (window.confirm("Are you sure to delete this item")) {
      console.log(id);
      let data;
      apiCtr.delete(data,'user/'+id,(resulData)=>{
        console.log("Get data  ->",resulData.data);
        swal({
          title: "Deleted!",
          text: "Sucessfully delete",
          // icon: "Delete",
        });
        // return false;
        setOpen(false);
        cancel();
        apicalling();
      })
    }


  }

  const cancel=()=>{
    setMyName("");
    setMyEmail("");
    setMyMobile("");
    setMyAddress("");
    window.location.reload();
  }
  let icon = <Button   >
  <SearchIcon />
  </Button>

 const handleClickOpen = (event,row) => {
    setOpen(true);
    console.log("row ",row);
    setMy_id(row._id);
    setEditName(row.fname);
    setEditEmail(row.email);
    setEditMobile(row.phone);
    setEditAddress(row.address);
    changed(row.address);
};

const handleClose = () => {
  setOpen(false);
};

const item=allUser.map((row,index)=>{
  
  return (
    <div>
    <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <div className="sideLeft">
            <Typography component="h5" variant="h5">
            {row.fname}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
            {row.email} | {row.phone}
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
            {row.address}
            </Typography>
            </div>            
            <div className='sideRight'>
            <IconButton aria-label="edit" onClick={(event) => handleClickOpen(event, row)}>
            <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={(event) => deleteUser(event, row._id)}  color="secondary">
            <DeleteIcon />
            </IconButton>       

            </div>
          </CardContent>
          
        </div>
        
        </Card>
        <br/>
    </div>


  );
  })

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="fullWidth">
          <Tab label="Create User" {...a11yProps(0)} />
          <Tab label="List User" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>

        {/* Create user code */}
        <div>
        <form className={classes.root} noValidate autoComplete="off">
        <TextField id="standard-basic" label="Name"  variant="filled" value={name}  onChange={(e) => setMyName(e.target.value)} /><br/>
        <TextField id="standard-basic" label="Email" variant="filled" value={email}  onChange={(e) => setMyEmail(e.target.value)}/><br/>
        <TextField id="standard-basic" label="Phone Number" variant="filled" value={mobile}  onChange={(e) => setMyMobile(e.target.value)}/><br/>
        <TextField id="standard-basic" label="Address" variant="filled" value={placeName}  onChange={(e) => setMyAddress(e.target.value)}  InputProps={{
        endAdornment: icon,
        onClick: () => getLatLng(placeName)
        }}/><br/>

        </form>
        <div className="setPosition">
        <Button variant="contained" color="primary" onClick={save}>  Save</Button>&nbsp;
        <Button variant="contained"  onClick={cancel} > Cancel</Button>
        <div
        id="google-map"
        ref={googleMapRef}
        style={{ width: '83%', height: '300px',marginTop:"10px" }}/>
        </div>
        </div>
          
      </TabPanel>
      <TabPanel value={value} index={1}>

        {/*User list code */}
        <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
         User Edit
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>
            <form className="changed" noValidate autoComplete="off">
            <TextField id="standard-basic" label="Name"  variant="filled" value={editName}  onChange={(e) => setEditName(e.target.value)} /><br/>

            <TextField id="standard-basic" label="Email" variant="filled" value={editEmail}  onChange={(e) => setEditEmail(e.target.value)}/><br/>

            <TextField id="standard-basic" label="Phone Number" variant="filled" value={editMobile}  onChange={(e) => setEditMobile(e.target.value)}/><br/>

            <TextField id="standard-basic" label="Address" variant="filled" value={editPlaceName}  onChange={(e) => setEditAddress(e.target.value)}  InputProps={{
            endAdornment: icon,
            onClick: () => changed(editPlaceName)
            }}/><br/>

            </form>
            <div className="setPosition"> 
            <div
            id="google-map"
            ref={googleMapRef}
            style={{ width: '83%', height: '300px',marginTop:"10px" }}/>
            </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>          
          <Button onClick={save} color="primary" >
          Save
          </Button>
          <Button autoFocus onClick={(event) => deleteUser(event, _id)} color="Secondary">
          Delete
          </Button>
        </DialogActions>
      </Dialog>
        {item}
      </TabPanel>     
    </div>
  );
}
