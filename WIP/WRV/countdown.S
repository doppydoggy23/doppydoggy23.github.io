.data
askuserstr:
	.asciiz "Please, enter a number 0-10\n"
carrret:
	.asciiz "\n"
.text
	li a0, 2        #prompt the user for a number
    	la a1, askuserstr #string to print
                    	#returns the number in a0
	ecall
	add t0, a0, zero #store the number in t0

decloop:
	li a0, 1      	#print number syscall
    	add a1, t0, zero  #number to print
	ecall

	li a0, 0        #print string carriage return 
	la a1, carrret	#asciiz string addr
	ecall

	addi t0, t0, -1
	bge t0, zero, decloop
exit: