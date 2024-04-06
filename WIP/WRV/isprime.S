    	.data
PRIMESTRING:
	.asciiz " is prime\n"
NOTPRIMESTRING:
	.asciiz " is NOT prime\n"
userp:
	.asciiz "Please, enter a number 0-100"

    #here it goes the code
    .text
main:

#prompt the user for a number
	li a0, 2        #prompt the user for a number
	la a1, userp    #string to print
                    	#returns the number in a0
	ecall
	add s0, a0, zero

#print the number
	add a1, s0, zero #number to print in a1
	li a0, 1      	#print number syscall
	ecall

#print if it's prime or not
	add a0, zero, s0
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
	jalr zero, 0(ra) 	#pseudoinstruction ret


# subroutine isprime
# prints "prime" or "NOT Prime" according to a number passed in a0
isprime:
	addi sp,sp,-16
	sw ra,0(sp) 	#save return address
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
	add a1, zero, t5
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
    	li a0, 0         # this is the string printing syscall 
	la a1, PRIMESTRING
    	ecall
	j isprimeexit
isprimeprintnotprime:
    	li a0, 0         # this is the string printing syscall 
	la a1, NOTPRIMESTRING
    	ecall
	j isprimeexit
isprimeexit:
	lw ra,0(sp) 	#restore return address
	addi sp,sp,16
	ret

#
# program exit point
programexit: