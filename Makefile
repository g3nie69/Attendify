run:
	python3 Backend/app.py

run-frontend:
	cd Frontend && npm run dev

clean:
	find . -name "*.pyc" -exec rm -f {} \;
	rm -rf */__pycache__
	rm -rf */*/__pycache__
