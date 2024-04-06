#here it goes the kernel code
#it setups the stack pointer
	addi	zero,zero,0 
kernel:             
	addi	sp,zero,1536
	call	main        
	addi	zero,zero,0 
	mv      s1,a0   
	addi	zero,zero,0 
	addi	zero,zero,0 
	auipc	ra,0x0      
	jalr	ra,0(ra)    
	addi	zero,zero,0 
	addi	zero,zero,0 

    #here it goes the read only data
    .rodata
PRIMESTRING:
    .word 0x4D495250
    .word 0x00000D45
NOTPRIMESTRING:
    .word 0x20544F4E
    .word 0x4D495250
    .word 0x00000D45

    #here it goes the code
    .text
main:

	addi a0, zero, 2
    	addi t0, zero, 1 	#number print service
    	ecall 			#call OS, print the number in a0
	call isprime 		#check if it's prime
	addi a0, zero, 5
    	addi t0, zero, 1 	#number print service
    	ecall 			#call OS, print the number in a0
	call isprime 		#check if it's prime
	addi a0, zero, 4
    	addi t0, zero, 1 	#number print service
    	ecall 			#call OS, print the number in a0
	call isprime 		#check if it's prime
	addi a0, zero, 10
    	addi t0, zero, 1 	#number print service
    	ecall 			#call OS, print the number in a0
	call isprime 		#check if it's prime
	addi a0, zero, 11
    	addi t0, zero, 1 	#number print service
    	ecall 			#call OS, print the number in a0
	call isprime 		#check if it's prime
	addi a0, zero, 43
    	addi t0, zero, 1 	#number print service
    	ecall 			#call OS, print the number in a0
	call isprime 		#check if it's prime
	addi a0, zero, 44
    	addi t0, zero, 1 	#number print service
    	ecall 			#call OS, print the number in a0
	call isprime 		#check if it's prime
	j programexit

# subroutine divide
# divides a0 (dividend) by a1 (divisor)
# returns a0 (remainder), a1 (quotient)
# uses t registers
divide:
	addi t0, zero, 0 #reset temporary quotient
divideloop:
	blt a0, a1, divideexit 	#exit if dividend less than divisor
	sub a0, a0, a1
	addi t0, t0, 1 		#add 1 to quotient
	jal zero, divideloop 	#pseudoinstruction j
divideexit:
	addi a1, t0, 0
	jalr zero, ra, 0 	#pseudoinstruction ret


# subroutine isprime
# prints "prime" or "NOT Prime" according to a number passed in a0
isprime:
	addi	sp,sp,-16
	sw	ra,0(sp) 	#save return address
	#
	addi t6, zero, 2
	addi t5, a0, -1
	#
isprimeloop:
	blt t5, t6, isprimeprintprime
	# save t registers used
	sw t5, 4(sp)
	sw t6, 8(sp)
	sw a0, 12(sp)
	#
	# a0 contains the initial argument
	mv a1, t5
	jal ra, divide 		#pseudoinstruction call, we call subroutine divide
	beq a0, zero, isprimeprintnotprime 	# if remainder is zero, we have a divisor
	# restore t registers used
	lw t5, 4(sp)
	lw t6, 8(sp)
	lw a0, 12(sp)
	#
	addi t5, t5, -1
	j isprimeloop
	#
isprimeprintprime:
    	addi t0, zero, 3         # this is the string printing syscall 
    	lui a0, %hi(PRIMESTRING)      # this loads the top 20 bits 
	addi a0, a0, %lo(PRIMESTRING) # this loads the bottom 12 bits
    	addi a1, zero, 6         # length of the string
    	ecall
	j isprimeexit
isprimeprintnotprime:
    	addi t0, zero, 3         # this is the string printing syscall 
    	lui a0, %hi(NOTPRIMESTRING)      # this loads the top 20 bits 
	addi a0, a0, %lo(NOTPRIMESTRING) # this loads the bottom 12 bits
    	addi a1, zero, 10         # length of the string
    	ecall
	j isprimeexit
isprimeexit:
	lw	ra,0(sp) 	#restore return address
	addi	sp,sp,16
	ret

#
# program exit point
programexit: