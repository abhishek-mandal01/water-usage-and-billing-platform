package com.abhishekmandal.water_usage_backend.controller;

import com.abhishekmandal.water_usage_backend.entity.Bill;
import com.abhishekmandal.water_usage_backend.repository.BillRepository;
import com.abhishekmandal.water_usage_backend.service.BillingService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillingService billingService;

    @PostMapping("/create-order/{billId}")
    public ResponseEntity<?> createOrder(@PathVariable Long billId) {
        try {
            Optional<Bill> billOpt = billRepository.findById(billId);
            if (billOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Bill not found");
            }
            Bill bill = billingService.applyLateFeeIfNeeded(billOpt.get());

            if ("PAID".equals(bill.getStatus())) {
                return ResponseEntity.badRequest().body("Bill is already paid");
            }

            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            // Amount in paise (multiply INR by 100)
            int amountInPaise = (int) Math.round(bill.getAmount() * 100);
            if (amountInPaise <= 0) {
                return ResponseEntity.badRequest().body("Bill amount must be greater than zero.");
            }
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + bill.getId());

            Order order = razorpay.orders.create(orderRequest);

            // Save the order ID to the bill
            bill.setRazorpayOrderId(order.get("id"));
            billRepository.save(bill);

            return ResponseEntity.ok(order.toString());
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body("Error creating Razorpay order. Please try again.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred. Please try again.");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            String razorpayOrderId = request.getRazorpayOrderId();
            String razorpayPaymentId = request.getRazorpayPaymentId();
            String razorpaySignature = request.getRazorpaySignature();
            Long billId = request.getBillId();

            if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null || billId == null) {
                return ResponseEntity.badRequest().body("Missing required payment verification fields.");
            }

            // Format required for verification: order_id + "|" + payment_id
            String payload = razorpayOrderId + "|" + razorpayPaymentId;

            // Verify signature using Razorpay SDK
            boolean isValidSignature = Utils.verifySignature(payload, razorpaySignature, keySecret);

            if (isValidSignature) {
                Optional<Bill> billOpt = billRepository.findById(billId);
                if (billOpt.isPresent()) {
                    Bill bill = billingService.applyLateFeeIfNeeded(billOpt.get());
                    
                    // Guard against double-payment
                    if ("PAID".equals(bill.getStatus())) {
                        return ResponseEntity.ok("Bill was already marked as paid.");
                    }
                    
                    bill.setStatus("PAID");
                    bill.setPaidDate(LocalDate.now());
                    bill.setRazorpayPaymentId(razorpayPaymentId);
                    billRepository.save(bill);
                    return ResponseEntity.ok("Payment successful and verified");
                } else {
                    return ResponseEntity.badRequest().body("Bill not found");
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid signature");
            }
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body("Error verifying payment signature.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred during verification.");
        }
    }
}

class PaymentVerificationRequest {
    private Long billId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    public Long getBillId() { return billId; }
    public void setBillId(Long billId) { this.billId = billId; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }
}
