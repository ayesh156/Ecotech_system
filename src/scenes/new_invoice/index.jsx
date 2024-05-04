import * as React from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
  useMediaQuery,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';

const data = { names: ["Shawshank", "Chathuranga", "Malaka"] };

const New_invoice = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [gridRows, setGridRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [lastId, setLastId] = useState(0);
  const [open, setOpen] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDueDate, setSelectedDueDate] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isCustomerError, setIsCustomerError] = useState(false);
  const [isDateError, setIsDateError] = useState(false);
  const [isDueDateError, setIsDueDateError] = useState(false);
  const [summary, setSummary] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [footerNotes, setFooterNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteRow = (idToDelete) => {
    setGridRows((prevRows) => prevRows.filter((row) => row.id !== idToDelete));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      editable: true,
    },
    {
      field: "qty",
      headerName: "Quantity",
      flex: 1,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price (Rs.)",
      flex: 1,
      editable: true,
    },
    {
      field: "tax",
      headerName: "Tax (%)",
      flex: 1,
      editable: true,
    },
    {
      field: "amount",
      headerName: "Amount (Rs.)",
      flex: 1,
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      renderCell: (params) => (
        <Button onClick={() => handleDeleteRow(params.row.id)}>
          <DeleteIcon style={{ color: colors.redAccent[500] }} />
        </Button>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.5,
      renderCell: (params) => (
        <Button onClick={() => handleEditRow(params.row)}>
          <EditIcon style={{ color: colors.blueAccent[500] }} />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    // Calculate total amount whenever gridRows change
    let sum = 0;
    gridRows.forEach((row) => {
      sum += parseFloat(row.amount);
    });
    setTotalAmount(sum);
  }, [gridRows]);

  const collectData = () => {
    // Collect values from Autocomplete
    const selectedCustomer = customer;

    // Collect values from Datepickers
    const selectedDateValue = selectedDate
      ? selectedDate.format("YYYY-MM-DD")
      : null;
    const selectedDueDateValue = selectedDueDate
      ? selectedDueDate.format("YYYY-MM-DD")
      : null;

    // Collect values from DataGrid rows
    const productTable = gridRows.map((row) => ({
      name: row.name,
      description: row.description,
      qty: row.qty,
      price: row.price,
      tax: row.tax,
      amount: row.amount,
    }));

    // Combine all collected values into one object
    const collectedData = {
      selectedCustomer,
      summary,
      invoiceNumber,
      notes,
      paymentInstructions,
      footerNotes,
      selectedDate: selectedDateValue,
      selectedDueDate: selectedDueDateValue,
      productTable,
    };

    return collectedData;
  };

  const getDataButtonClick = () => {
    if (!customer || !selectedDate || !selectedDueDate) {
      setIsCustomerError(!customer);
      setIsDateError(!selectedDate);
      setIsDueDateError(!selectedDueDate);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const collectedData = collectData();
      console.log(collectedData);

      // Reset form data
      setCustomer(null);
      setIsCustomerError(false);
      setSelectedDate(null);
      setIsDateError(false);
      setSelectedDueDate(null);
      setIsDueDateError(null);
      setSummary("");
      setInvoiceNumber("");
      setNotes("");
      setPaymentInstructions("");
      setFooterNotes("");

      // Clear table rows
      setGridRows([]);
      setIsLoading(false);
    }, 1000); // Change the timeout value as needed
  };

  const [newRow, setNewRow] = useState({
    id: "",
    name: "",
    description: "",
    qty: "",
    price: "",
    tax: "",
    amount: "",
  });

  const handleButtonClick = () => {
    const newId = lastId + 1;
    const parsedQty =
      newRow.qty.trim() !== "" && parseFloat(newRow.qty) >= 0
        ? parseFloat(newRow.qty)
        : 0;
    const parsedPrice =
      newRow.price.trim() !== "" && parseFloat(newRow.price) >= 0
        ? parseFloat(newRow.price)
        : 0;
    const parsedTax =
      newRow.tax.trim() !== "" && parseFloat(newRow.tax) >= 0
        ? parseFloat(newRow.tax)
        : 0;

    setGridRows((prevRows) => [
      ...prevRows,
      {
        id: newId,
        name: newRow.name,
        description: newRow.description,
        qty: parsedQty,
        price: parsedPrice,
        tax: parsedTax,
        amount: calculateAmount(parsedQty, parsedPrice, parsedTax),
      },
    ]);
    setNewRow({
      id: newId,
      name: "",
      description: "",
      qty: "",
      price: "",
      tax: "",
      amount: "",
    });

    setLastId(newId);
  };

  const calculateAmount = (qty, price, tax) => {
    const amount = qty * price;
    const taxAmount = (amount * tax) / 100;
    const totalAmount = amount - taxAmount;
    return totalAmount;
  };

  const handleEditRow = (row) => {
    setOpen(true);
    setSelectedRow(row);
  };

  const handleSaveEdit = () => {
    if (selectedRow) {
      const updatedRows = gridRows.map((row) =>
        row.id === selectedRow.id
          ? {
              ...row,
              name: selectedRow.name,
              description: selectedRow.description,
              qty: selectedRow.qty,
              price: selectedRow.price,
              tax: selectedRow.tax,
              amount: calculateAmount(
                parseFloat(selectedRow.qty),
                parseFloat(selectedRow.price),
                parseFloat(selectedRow.tax)
              ),
            }
          : row
      );
      setGridRows(updatedRows);
      setSelectedRow(null);
    }
    setOpen(false);
  };

  return (
    <Box m="20px">
      
        <Button
          sx={{display: "flex", alignItems: "center",}}
          color="inherit"
          onClick={() => {
            navigate(-1);
          }}
        >
          <KeyboardArrowLeftOutlinedIcon sx={{fontSize: "35px"}} />
          <Typography variant="h3" fontWeight="bold" textTransform={"capitalize"} color={colors.grey[100]}>New Invoices</Typography>
          
        </Button>
      <Box
        m="40px 0 0 0"
        sx={{ display: "flex", justifyContent: "space-between", gap: "100px" }}
      >
        <TextField
          label="Summary"
          multiline
          rows={4}
          fullWidth
          color="secondary"
          sx={{ marginTop: "10px" }}
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              marginTop: "10px",
              gridColumn: "span 4",
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data.names}
              value={customer}
              onChange={(event, newValue) => {
                setCustomer(newValue);
                setIsCustomerError(newValue === null);
              }}
              fullWidth
              sx={{ position: "relative" }}
              renderInput={(params) => (
                <>
                  <TextField {...params} label="Customer" color="secondary" />
                  {isCustomerError && (
                    <FormHelperText
                      sx={{
                        color: colors.redAccent[500],
                        marginLeft: "10px",
                        position: "absolute", // Set position absolute
                        bottom: -20, // Adjust this value as needed
                        left: 0,
                      }}
                    >
                      The customer field is required
                    </FormHelperText>
                  )}
                </>
              )}
            />
            <TextField
              color="secondary"
              label="Invoice number"
              fullWidth
              sx={{ alignSelf: "flex-end" }}
              value={invoiceNumber}
              onChange={(event) => {
                setInvoiceNumber(event.target.value);
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "20px", marginTop: "10px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={selectedDate}
                  format="YYYY-MM-DD"
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                  }}
                  slotProps={{
                    textField: () => ({
                      color: "secondary",
                      helperText: !selectedDate ? (
                        <span style={{ color: colors.redAccent[500] }}>
                          {isDateError && "The Date field is required"}
                        </span>
                      ) : null,
                    }),
                  }}
                  label="Date"
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={selectedDueDate}
                  format="YYYY-MM-DD"
                  onChange={(newValue) => {
                    setSelectedDueDate(newValue);
                  }}
                  slotProps={{
                    textField: () => ({
                      color: "secondary",
                      helperText: !selectedDueDate ? (
                        <span style={{ color: colors.redAccent[500] }}>
                          {isDueDateError && "The Due Date field is required"}
                        </span>
                      ) : null,
                    }),
                  }}
                  label="Payment due date"
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
      </Box>

      <Box m="40px 0 0 0" height="75vh">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: 2,
            mb: 5,
            gap: 2,
          }}
        >
          {Object.entries(newRow).map(([fieldName, value]) => {
            // Exclude id and amount fields from rendering
            if (fieldName !== "id" && fieldName !== "amount") {
              if (fieldName === "name") {
                return (
                  <Autocomplete
                    key={fieldName}
                    options={mockDataInvoices}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setNewRow((prevRow) => ({
                          ...prevRow,
                          name: newValue.name,
                          description: "",
                          qty: "",
                          price: "",
                          tax: "",
                          amount: "",
                        }));
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Name"
                        color="secondary"
                        sx={{
                          width: "200px",
                        }}
                      />
                    )}
                  />
                );
              } else {
                return (
                  <TextField
                    key={fieldName}
                    color="secondary"
                    label={
                      fieldName === "tax"
                        ? `${
                            fieldName.charAt(0).toUpperCase() +
                            fieldName.slice(1)
                          } (%)`
                        : fieldName === "price" || fieldName === "amount"
                        ? `${
                            fieldName.charAt(0).toUpperCase() +
                            fieldName.slice(1)
                          } (Rs.)`
                        : `${
                            fieldName.charAt(0).toUpperCase() +
                            fieldName.slice(1)
                          }`
                    }
                    value={value}
                    sx={{
                      width: fieldName === "description" ? "400px" : "auto",
                    }}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setNewRow((prevRow) => ({
                        ...prevRow,
                        [name]: value,
                        amount:
                          name === "qty" || name === "price" || name === "tax"
                            ? calculateAmount(
                                prevRow.qty,
                                prevRow.price,
                                prevRow.tax
                              )
                            : prevRow.amount,
                      }));
                    }}
                    name={fieldName}
                  />
                );
              }
            }
            return null;
          })}
        </Box>

        <Box
          m="20px 0 0 0"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid autoHeight hideFooter rows={gridRows} columns={columns} />
        </Box>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Button
            sx={{
              color: colors.redAccent[300],
              minWidth: "150px",
              textTransform: "capitalize",
              fontSize: "16px",
              "&:hover": {
                color: colors.redAccent[400],
              },
            }}
            onClick={handleButtonClick}
          >
            <AddIcon /> Add another product
          </Button>
          <Box display="flex" justifyContent="space-between" p={2}>
            <Typography variant="h5" mr="10px">
              Total:
            </Typography>
            <Typography variant="h5">LKR {totalAmount.toFixed(2)}</Typography>
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
        >
          <TextField
            label="Notes"
            multiline
            rows={4}
            color="secondary"
            fullWidth
            sx={{ marginTop: "10px" }}
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
            }}
          />
          <TextField
            label="Payment Instructions"
            multiline
            rows={4}
            color="secondary"
            fullWidth
            sx={{ marginTop: "10px" }}
            value={paymentInstructions}
            onChange={(event) => {
              setPaymentInstructions(event.target.value);
            }}
          />
        </Box>
        <Box
          mt={5}
          pb={4}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "100px",
          }}
        >
          <TextField
            fullWidth
            color="secondary"
            label="Add footer notes"
            value={footerNotes}
            onChange={(event) => {
              setFooterNotes(event.target.value);
            }}
          />
          <LoadingButton
            loading={isLoading}
            loadingPosition="end"
            endIcon={<SendIcon />}
            variant="contained"
            onClick={getDataButtonClick}
            sx={{
              color: colors.grey[100],
              minWidth: "150px",
              backgroundColor: colors.blueAccent[700],
              "&:hover": {
                backgroundColor: colors.blueAccent[600],
              },
            }}
          >
            Send invoice
          </LoadingButton>
        </Box>
      </Box>

      <React.Fragment>
        <Dialog
          open={open}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle fontSize={16}>{"Edit Selected Product"}</DialogTitle>
          {selectedRow && (
            <DialogContent>
              <Box
                maxWidth="400px"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobile ? undefined : "span 4",
                  },
                }}
              >
                <Box
                  sx={{
                    display: isNonMobile ? "flex" : undefined,
                    gap: isNonMobile ? "20px" : undefined,
                    marginTop: "15px",
                  }}
                >
                  <TextField
                    label="Name"
                    color="secondary"
                    value={selectedRow.name}
                    onChange={(e) =>
                      setSelectedRow({ ...selectedRow, name: e.target.value })
                    }
                  />
                  <TextField
                    label="Quantity"
                    color="secondary"
                    value={selectedRow.qty}
                    type="number"
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      setSelectedRow({
                        ...selectedRow,
                        qty: isNaN(newValue) || newValue < 0 ? 0 : newValue,
                      });
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: isNonMobile ? "flex" : undefined,
                    gap: isNonMobile ? "20px" : undefined,
                    marginTop: "15px",
                  }}
                >
                  <TextField
                    label="Price (Rs.)"
                    color="secondary"
                    type="number"
                    value={selectedRow.price}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      setSelectedRow({
                        ...selectedRow,
                        price: isNaN(newValue) || newValue < 0 ? 0 : newValue,
                      });
                    }}
                  />
                  <TextField
                    label="Tax (%)"
                    color="secondary"
                    type="number"
                    value={selectedRow.tax}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      setSelectedRow({
                        ...selectedRow,
                        tax: isNaN(newValue) || newValue < 0 ? 0 : newValue,
                      });
                    }}
                  />
                </Box>
                <TextField
                  label="Description"
                  color="secondary"
                  value={selectedRow.description}
                  sx={{
                    display: isNonMobile ? "flex" : undefined,
                    gap: isNonMobile ? "20px" : undefined,
                    marginTop: "15px",
                  }}
                  onChange={(e) =>
                    setSelectedRow({
                      ...selectedRow,
                      description: e.target.value,
                    })
                  }
                />
              </Box>
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: colors.primary[100] }}>
              Close
            </Button>
            <Button
              onClick={handleSaveEdit}
              sx={{ color: colors.primary[100] }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </Box>
  );
};

export default New_invoice;
